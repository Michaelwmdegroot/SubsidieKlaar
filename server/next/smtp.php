<?php
declare(strict_types=1);

/**
 * Small dependency-free, authenticated SMTP transport for transactional mail.
 * Used only with an explicitly configured private mailbox and TLS.
 * No credentials or SMTP server responses are ever emitted to callers.
 */

function srn_smtp_private_env(string $dir): array {
    $path=rtrim($dir,'/').'/.env';
    if (!is_file($path)) return [];
    if (is_link($path) || !is_readable($path) || filesize($path)>32768) {
        throw new RuntimeException('Ongeldige private SMTP-configuratie.');
    }
    $data=file($path, FILE_IGNORE_NEW_LINES);
    if (!is_array($data)) throw new RuntimeException('Private SMTP-configuratie onleesbaar.');
    $keys=['SMTP_HOST','SMTP_PORT','SMTP_ENCRYPTION','SMTP_USERNAME','SMTP_PASSWORD'];
    $result=[];
    foreach ($data as $line) {
        $line=trim($line);
        if ($line==='' || $line[0]==='#' || $line[0]===';') continue;
        if (!preg_match('/^([A-Z][A-Z0-9_]*)=(.*)$/D', $line, $m)) continue;
        if (in_array($m[1],$keys,true)) {
            if (array_key_exists($m[1],$result)) throw new RuntimeException('Dubbele SMTP-instelling.');
            $result[$m[1]]=trim($m[2]);
        }
    }
    return $result;
}

function srn_smtp_profile(array $c): array {
    if (($c['transport']??'')!=='smtp') throw new RuntimeException('SMTP is niet geselecteerd.');
    if (!extension_loaded('openssl')) throw new RuntimeException('TLS niet beschikbaar.');
    $mail=(isset($c['smtp'])&&is_array($c['smtp']))?$c['smtp']:[];
    $private=srn_smtp_private_env((string)($c['dir']??''));
    $value=static function(string $k,string $env)use($mail,$private): string {
        if (isset($mail[$k]) && is_string($mail[$k]) && $mail[$k]!=='')return $mail[$k];
        $v=getenv($env);
        return is_string($v)&&$v!==''?$v:($private[$env]??'');
    };
    $host=$value('host','SMTP_HOST');
    $port=$value('port','SMTP_PORT');
    $secure=strtolower($value('encryption','SMTP_ENCRYPTION'));
    $user=$value('username','SMTP_USERNAME');
    $pass=$value('password','SMTP_PASSWORD');
    $from=$c['mail_from']??'';
    if (!is_string($from)||!filter_var($from,FILTER_VALIDATE_EMAIL)||
        !preg_match('/^[A-Za-z0-9.-]+$/D',$host)||!str_contains($host,'.')||
        !in_array($secure,['ssl','tls','starttls'],true)||
        !(($secure==='ssl'&&$port==='465')||($secure!=='ssl'&&$port==='587'))||
        !filter_var($user,FILTER_VALIDATE_EMAIL)||$pass===''||
        strlen($pass)>1024||preg_match('/[\r\n\x00]/',$pass)) {
        throw new RuntimeException('SMTP-instellingen onvolledig of ongeldig.');
    }
    return ['host'=>$host,'port'=>(int)$port,'security'=>$secure,
        'username'=>$user,'password'=>$pass,'from'=>$from];
}

function srn_smtp_read($socket,array $expected): string {
    $reply='';
    for ($i=0;$i<24;$i++) {
        $line=fgets($socket,1024);
        if ($line===false||strlen($line)>998||
            !preg_match('/^([0-9]{3})([- ])[^\r\n]*\r?\n$/D',$line,$m)) {
            throw new RuntimeException('SMTP-antwoord ongeldig.');
        }
        $reply.=$line;
        if ($m[2]===' ') {
            if (!in_array((int)$m[1],$expected,true)) throw new RuntimeException('SMTP-opdracht geweigerd.');
            return $reply;
        }
    }
    throw new RuntimeException('SMTP-antwoord te lang.');
}

function srn_smtp_write($socket,string $data): void {
    $length=strlen($data);
    for ($offset=0;$offset<$length;) {
        $written=fwrite($socket,substr($data,$offset));
        if ($written===false||$written===0)throw new RuntimeException('SMTP-verbinding verbroken.');
        $offset+=$written;
    }
}

function srn_smtp_command($socket,string $cmd,array $expected): string {
    srn_smtp_write($socket,$cmd."\r\n");
    return srn_smtp_read($socket,$expected);
}

function srn_smtp_message(string $from,string $to,string $subject,string $body): string {
    if (!filter_var($from,FILTER_VALIDATE_EMAIL)||!filter_var($to,FILTER_VALIDATE_EMAIL)||
        $subject===''||strlen($subject)>180||!preg_match('/^[\x20-\x7e]+$/D',$subject)||
        strlen($body)>30000)throw new RuntimeException('Ongeldige SMTP-berichtinhoud.');
    // Quoted printable preserves UTF-8; SMTP dot-stuffing protects lines beginning with '.'.
    $normalized=str_replace(["\r\n","\r"],"\n",$body);
    $encoded=quoted_printable_encode(str_replace("\n","\r\n",$normalized));
    $lines=explode("\r\n",$encoded);
    foreach($lines as &$line)if(str_starts_with($line,'.'))$line='.'.$line;
    unset($line);
    $domain=substr($from,strrpos($from,'@')+1);
    return 'Date: '.gmdate('D, d M Y H:i:s +0000')."\r\n".
        'From: <'.$from.">\r\n".
        'To: <'.$to.">\r\n".
        'Subject: '.$subject."\r\n".
        'Message-ID: <'.bin2hex(random_bytes(16)).'@'.$domain.">\r\n".
        "MIME-Version: 1.0\r\n".
        "Content-Type: text/plain; charset=UTF-8\r\n".
        "Content-Transfer-Encoding: quoted-printable\r\n".
        "Auto-Submitted: auto-generated\r\n".
        "\r\n".implode("\r\n",$lines)."\r\n";
}

function srn_smtp_send(array $c,string $to,string $subject,string $body): bool {
    $p=srn_smtp_profile($c);
    $msg=srn_smtp_message($p['from'],$to,$subject,$body);
    $host=$p['host'];
    $context=stream_context_create(['ssl'=>[
        'verify_peer'=>true,'verify_peer_name'=>true,'allow_self_signed'=>false,
        'peer_name'=>$host,'SNI_enabled'=>true,
        'crypto_method'=>STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT|STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT
    ]]);
    $target=($p['security']==='ssl'?'ssl://':'tcp://').$host.':'.$p['port'];
    $errorCode=0;$errorText='';
    // Suppress PHP's socket diagnostics (they can contain private host details).
    $socket=@stream_socket_client($target,$errorCode,$errorText,10,STREAM_CLIENT_CONNECT,$context);
    if (!is_resource($socket))throw new RuntimeException('SMTP-verbinding mislukt.');
    try {
        stream_set_timeout($socket,10);
        srn_smtp_read($socket,[220]);
        $ehlo=parse_url((string)($c['origin']??''),PHP_URL_HOST)?:'localhost';
        if (!preg_match('/^[A-Za-z0-9.-]+$/D',$ehlo))$ehlo='localhost';
        $cap=srn_smtp_command($socket,'EHLO '.$ehlo,[250]);
        if ($p['security']!=='ssl') {
            if (!preg_match('/(?:^|\n)250[- ]STARTTLS(?:\r?\n|$)/',$cap))throw new RuntimeException('STARTTLS niet beschikbaar.');
            srn_smtp_command($socket,'STARTTLS',[220]);
            if (@stream_socket_enable_crypto($socket,true,STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT|STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT)!==true)throw new RuntimeException('STARTTLS mislukt.');
            $cap=srn_smtp_command($socket,'EHLO '.$ehlo,[250]);
        }
        if (!preg_match('/(?:^|\n)250[- ]AUTH ([^\r\n]+)/',$cap,$auth))throw new RuntimeException('SMTP-authenticatie niet beschikbaar.');
        $methods=preg_split('/\s+/',strtoupper(trim($auth[1])));
        if (in_array('PLAIN',$methods,true)) {
            srn_smtp_command($socket,'AUTH PLAIN '.base64_encode("\0".$p['username']."\0".$p['password']),[235]);
        } elseif (in_array('LOGIN',$methods,true)) {
            srn_smtp_command($socket,'AUTH LOGIN',[334]);
            srn_smtp_command($socket,base64_encode($p['username']),[334]);
            srn_smtp_command($socket,base64_encode($p['password']),[235]);
        } else {
            throw new RuntimeException('SMTP-authenticatiemethode ontbreekt.');
        }
        srn_smtp_command($socket,'MAIL FROM:<'.$p['from'].'>',[250]);
        srn_smtp_command($socket,'RCPT TO:<'.$to.'>',[250,251]);
        srn_smtp_command($socket,'DATA',[354]);
        srn_smtp_write($socket,$msg.".\r\n");
        srn_smtp_read($socket,[250]);
        // 250 after DATA confirms acceptance by the SMTP provider, not inbox delivery.
        try{srn_smtp_command($socket,'QUIT',[221]);}catch(Throwable){}
        return true;
    } finally {
        fclose($socket);
    }
}
