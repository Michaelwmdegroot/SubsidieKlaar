<?php
declare(strict_types=1);
if(PHP_SAPI!=='cli'){http_response_code(404);exit;}
require dirname(__DIR__,2).'/server/next/service.php';
$o=getopt('',['local','dir:','origin:']);$root=realpath(dirname(__DIR__,2));
if(!isset($o['local'])){fwrite(STDERR,"Deze setup maakt uitsluitend een lokale testomgeving. Voor staging: docs/next/STAGING.md.\n");exit(1);}
$dir=$o['dir']??dirname($root).'/subsidieready-next-private';$origin=$o['origin']??'http://127.0.0.1:8080';
if(!preg_match('~^http://127\.0\.0\.1:[0-9]{2,5}$~D',$origin)){fwrite(STDERR,"Gebruik een loopback-origin.\n");exit(1);}
if(!is_dir($dir)&&!mkdir($dir,0700,true))exit(1);$dir=realpath($dir);
if(!$dir||$dir===$root||str_starts_with($dir,$root.'/')||is_link($dir)||file_exists($dir.'/config.php')){fwrite(STDERR,"STOP: map onveilig of configuratie bestaat al.\n");exit(1);}
$c=['mode'=>'local','origin'=>$origin,'dir'=>$dir,'key'=>bin2hex(random_bytes(32)),'controller'=>'Lokale testomgeving — geen echte klantgegevens','contact'=>'test@example.invalid','privacy_reviewed'=>false,'transport'=>'spool','mail_ready'=>false,'mail_from'=>'test@example.invalid','accounts_enabled'=>true,'vault_enabled'=>true,'local_test_files'=>true,'leads_enabled'=>true,'staff_enabled'=>true,'staff'=>['manager@example.invalid'=>['role'=>'sales_manager','entity'=>'testbedrijf'],'verkoper@example.invalid'=>['role'=>'sales_agent','entity'=>'testbedrijf']],'destinations'=>['testbedrijf'=>['enabled'=>true,'name'=>'Fictief testbedrijf — geen echte aanvraag','topics'=>['thuisbatterij','zonnepanelen','warmtepomp'],'privacy'=>'/privacy/']]];
srn_atomic($dir.'/config.php',"<?php\nreturn ".var_export($c,true).";\n");
echo "Lokale testconfiguratie aangemaakt buiten de webroot.\nGebruik uitsluitend fictieve gegevens. Er wordt geen e-mail verstuurd.\n\nStart:\nSR_NEXT_CONFIG=".escapeshellarg($dir.'/config.php')." php -d upload_max_filesize=10M -d post_max_size=12M -S ".parse_url($origin,PHP_URL_HOST).':'.parse_url($origin,PHP_URL_PORT)." -t ".escapeshellarg($root).' '.escapeshellarg($root.'/scripts/next/router.php')."\n\nLees daarna de lokale inlogcodes in een tweede terminal:\nSR_NEXT_CONFIG=".escapeshellarg($dir.'/config.php')." php scripts/next/mail-worker.php --local-inbox\n\nOpen $origin/mijn-plan/\nSales-test: manager@example.invalid (manager), verkoper@example.invalid (toewijzing nodig).\n";
