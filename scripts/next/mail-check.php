<?php
declare(strict_types=1);
// One-command read-only SMTP settings check, plus optional explicit live test message.
// Never exposes credentials, private paths or SMTP server responses.
if(PHP_SAPI!=='cli'){http_response_code(404);exit;}
require dirname(__DIR__,2).'/server/next/service.php';

$arg=$argv[1]??'';
if($argc!==2||($arg!=='--check'&&!str_starts_with($arg,'--send-test='))) {
    fwrite(STDERR,"Gebruik: php scripts/next/mail-check.php --check | --send-test=email@voorbeeld.nl\n");
    exit(2);
}
$stage='private-config';
try {
    $root=realpath(dirname(__DIR__,2));
    if(!$root)throw new RuntimeException('Geen webroot.');
    $path=getenv('SR_NEXT_CONFIG')?:dirname($root).'/subsidieready-private/next-config.php';
    if(!is_string($path)||!is_file($path)||is_link($path))throw new RuntimeException('Geen private config.');
    $real=realpath($path);
    if(!$real||str_starts_with($real,$root.DIRECTORY_SEPARATOR))throw new RuntimeException('Config in webroot.');
    if(function_exists('opcache_invalidate'))@opcache_invalidate($real,true);
    $c=require $real;
    if(!is_array($c)||!in_array($c['mode']??'', ['production','staging','local'],true))throw new RuntimeException('Ongeldige config.');
    $dir=realpath($c['dir']??'');
    if(!$dir||!is_dir($dir)||is_link($c['dir'])||$dir===$root||
       str_starts_with($dir,$root.DIRECTORY_SEPARATOR))throw new RuntimeException('Private opslag vereist.');
    $c['dir']=$dir;
    $stage='smtp-settings';
    $smtp=srn_smtp_profile($c);
    if($arg==='--check'){
        echo json_encode(['status'=>'smtp_configured','transport'=>'smtp',
            'tls'=>$smtp['security']==='ssl'?'implicit-tls':'starttls',
            'mail_ready'=>($c['mail_ready']??false)===true,
            'accounts_enabled'=>($c['accounts_enabled']??false)===true,
            'delivery_test'=>'not_performed'],JSON_PRETTY_PRINT)."\n";
        exit(0);
    }
    $to=substr($arg,12);
    if(!filter_var($to,FILTER_VALIDATE_EMAIL)||preg_match('/[\r\n\x00]/',$to))throw new RuntimeException('Ongeldig adres.');
    $stage='smtp-delivery';
    $accepted=srn_smtp_send($c,$to,'SubsidieReady SMTP-test',
        "Dit is een technische test van de e-mailverbinding van SubsidieReady.\n".
        "Er is geen account of adviesaanvraag aangemaakt.\n");
    if(!$accepted)throw new RuntimeException('Niet geaccepteerd.');
    echo json_encode(['status'=>'accepted_by_smtp','mailbox_delivery'=>'not_confirmed',
        'mail_ready'=>($c['mail_ready']??false)===true,
        'accounts_enabled'=>($c['accounts_enabled']??false)===true],JSON_PRETTY_PRINT)."\n";
}catch(Throwable){
    fwrite(STDERR,"NO-GO [$stage]: controleer de private SMTP-instellingen of de mailserver; geen secrets getoond.\n");
    exit(1);
}
