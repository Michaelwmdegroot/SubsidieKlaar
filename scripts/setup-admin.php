<?php
declare(strict_types=1);
// Run through SSH/hosting terminal only. There is intentionally no web setup route.
if (PHP_SAPI !== 'cli') {http_response_code(404);exit;}
require dirname(__DIR__).'/server/bootstrap.php';
function ask(string $label, bool $secret=false): string {
    fwrite(STDOUT,$label.': ');
    $tty=function_exists('stream_isatty')&&stream_isatty(STDIN);
    if($secret&&$tty) shell_exec('stty -echo');
    try {$line=fgets(STDIN);if($line===false)throw new RuntimeException('Invoer afgebroken.');return trim($line);}
    finally {if($secret&&$tty){shell_exec('stty echo');fwrite(STDOUT,PHP_EOL);}}
}
try {
    $root=realpath(dirname(__DIR__));
    $dir=getenv('SUBSIDIEREADY_PRIVATE_DIR') ?: dirname($root).'/subsidieready-private';
    if(!is_dir($dir)&&!mkdir($dir,0700,true))throw new RuntimeException('Kan private opslag niet maken.');
    $dir=sr_private_dir();chmod($dir,0700);$file=$dir.'/config.php';
    if(in_array('--check',$argv,true)){$c=sr_config();fwrite(STDOUT,'Beheer geconfigureerd; statistieken '.(($c['analytics_enabled']??false)?'aan':'uit').'.'.PHP_EOL);exit;}
    if(is_file($file))throw new RuntimeException('Configuratie bestaat al. Niet overschreven. Gebruik --check; wijzig instellingen via de beveiligde hostingconsole.');
    fwrite(STDOUT,"SubsidieReady beheer activeren\nDe opgegeven beheerorganisatie en het contactadres worden openbaar in de privacyuitleg.\n");
    $operator=ask('Naam van verantwoordelijke persoon of organisatie');
    $contact=ask('Bereikbaar contact-e-mailadres');
    if($operator===''||strlen($operator)>200||!filter_var($contact,FILTER_VALIDATE_EMAIL))throw new RuntimeException('Vul een geldige naam en bereikbaar e-mailadres in.');
    $password=ask('Nieuw uniek beheerderswachtwoord (16–128 tekens)',true);
    if(strlen($password)<16||strlen($password)>128)throw new RuntimeException('Gebruik 16–128 tekens.');
    if(!hash_equals($password,ask('Herhaal beheerderswachtwoord',true)))throw new RuntimeException('Wachtwoorden zijn niet gelijk.');
    $metrics=strtolower(ask('Optionele, toestemmingsgebonden gebruikstellingen activeren? [nee/ja]'))==='ja';
    $algorithm=defined('PASSWORD_ARGON2ID')?PASSWORD_ARGON2ID:PASSWORD_DEFAULT;
    $c=['base_url'=>'https://subsidieready.nl','operator'=>$operator,'contact'=>$contact,'password_hash'=>password_hash($password,$algorithm),'secret'=>bin2hex(random_bytes(32)),'analytics_enabled'=>$metrics];
    $handle=fopen($file,'x');if($handle===false)throw new RuntimeException('Configuratie bestaat al of kan niet worden geschreven.');
    chmod($file,0600);
    try{if(fwrite($handle,"<?php\n// Private. Keep outside public_html and out of Git.\nreturn ".var_export($c,true).";\n")===false)throw new RuntimeException('Schrijven mislukt.');}finally{fclose($handle);}
    unset($password,$c);
    fwrite(STDOUT,"Gereed. Open https://subsidieready.nl/admin/ via HTTPS.\nBewaar het wachtwoord in je wachtwoordmanager; het wordt niet weergegeven of per e-mail verstuurd.\n");
} catch(Throwable $e){fwrite(STDERR,$e->getMessage().PHP_EOL);exit(1);}
