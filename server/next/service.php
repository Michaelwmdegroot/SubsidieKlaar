<?php
declare(strict_types=1);
/* Testrelease backend: encrypted, locked single-host pilot storage. Off without private config. */
const SRN_SCHEMA=1;
const SRN_RULE='2026.11.14.3-beta';
function srn_id(): string { return bin2hex(random_bytes(16)); }
function srn_error(string $message,int $status=400): array {return ['_status'=>$status,'error'=>$message];}
function srn_config(): array {
 $root=realpath(dirname(__DIR__,2));$cfg=getenv('SR_NEXT_CONFIG');if(is_string($cfg))clearstatcache(true,$cfg);
 if(!$cfg || !is_file($cfg) || is_link($cfg)) throw new RuntimeException('Niet geconfigureerd.');
 $real=realpath($cfg);if(!$real || str_starts_with($real,$root.DIRECTORY_SEPARATOR))throw new RuntimeException('Private configuratie vereist.');
 if(function_exists('opcache_invalidate'))@opcache_invalidate($real,true);$c=require $real;if(!is_array($c)||!in_array($c['mode']??'', ['local','staging'],true))throw new RuntimeException('Alleen testmodus toegestaan.');
 $dir=realpath($c['dir']??'');if(!$dir||!is_dir($dir)||is_link($c['dir'])||$dir===$root||str_starts_with($dir,$root.DIRECTORY_SEPARATOR))throw new RuntimeException('Private opslag vereist.');
 $origin=$c['origin']??'';$u=parse_url($origin);if(!$u||!isset($u['scheme'],$u['host'])||isset($u['user'])||isset($u['pass'])||isset($u['query'])||isset($u['fragment'])||($u['path']??'')!=='')throw new RuntimeException('Ongeldige origin.');
 $local=$c['mode']==='local';if($local && !preg_match('~^http://127\.0\.0\.1:[0-9]{2,5}$~D',$origin))throw new RuntimeException('Loopback vereist.');
 if(!$local && ($u['scheme']!=='https'||in_array(strtolower($u['host']),['subsidieready.nl','www.subsidieready.nl'])))throw new RuntimeException('Productiedomein niet toegestaan in deze testrelease.');
 if(!extension_loaded('sodium')||!is_string($c['key']??null)||!preg_match('/^[a-f0-9]{64}$/D',$c['key']))throw new RuntimeException('Sleutel ontbreekt.');
 if(!is_string($c['controller']??null)||trim($c['controller'])===''||!filter_var($c['contact']??'',FILTER_VALIDATE_EMAIL))throw new RuntimeException('Verantwoordelijke ontbreekt.');
 if(!$local && ($c['privacy_reviewed']??false)!==true)throw new RuntimeException('Privacy-goedkeuring ontbreekt.');
 if(!in_array($c['transport']??'', ['spool','mail'],true)||(!$local && $c['transport']==='spool'))throw new RuntimeException('Mailtransport ontbreekt.');
 $c['dir']=$dir;$c['keyBytes']=hex2bin($c['key']);return $c;
}
function srn_encrypt(string $plain,array $c): string {$n=random_bytes(SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);return 'SRN1'.$n.sodium_crypto_secretbox($plain,$n,$c['keyBytes']);}
function srn_decrypt(string $raw,array $c): string {if(substr($raw,0,4)!=='SRN1')throw new RuntimeException('Ongeldige opslag.');$v=sodium_crypto_secretbox_open(substr($raw,28),substr($raw,4,24),$c['keyBytes']);if($v===false)throw new RuntimeException('Opslag niet leesbaar.');return $v;}
function srn_atomic(string $path,string $bytes): void {
 if(is_link($path)||!is_dir(dirname($path)))throw new RuntimeException('Ongeldig opslagpad.');
 $tmp=tempnam(dirname($path),'.srn-');if($tmp===false)throw new RuntimeException('Opslagfout.');
 try{chmod($tmp,0600);$h=fopen($tmp,'wb');if(!$h)throw new RuntimeException('Opslagfout.');try{$n=fwrite($h,$bytes);if($n!==strlen($bytes)||!fflush($h))throw new RuntimeException('Opslagfout.');if(function_exists('fsync'))fsync($h);}finally{fclose($h);}if(!rename($tmp,$path))throw new RuntimeException('Opslagfout.');}finally{if(is_file($tmp))unlink($tmp);}
}
function srn_empty(): array {return ['schema'=>SRN_SCHEMA,'accounts'=>[],'sessions'=>[],'challenges'=>[],'projects'=>[],'files'=>[],'leads'=>[],'outbox'=>[],'limits'=>[],'audit'=>[],'reminders'=>[]];}
function srn_tx(array $c,callable $fn): mixed {
 $lockPath=$c['dir'].'/state.lock';if(is_link($lockPath))throw new RuntimeException('Ongeldig opslagpad.');$lock=fopen($lockPath,'c');if(!$lock)throw new RuntimeException('Opslag bezet.');chmod($lockPath,0600);$start=microtime(true);
 while(!flock($lock,LOCK_EX|LOCK_NB)){if(microtime(true)-$start>3){fclose($lock);throw new RuntimeException('Opslag bezet.');}usleep(20000);}
 try{$f=$c['dir'].'/state.bin';if(is_link($f))throw new RuntimeException('Ongeldige opslag.');if(is_file($f)&&filesize($f)>12*1024*1024)throw new RuntimeException('Opslaglimiet.');$s=is_file($f)?json_decode(srn_decrypt((string)file_get_contents($f),$c),true,64,JSON_THROW_ON_ERROR):srn_empty();if(($s['schema']??0)!==SRN_SCHEMA)throw new RuntimeException('Schemafout.');foreach(array_keys(srn_empty())as$k)if($k!=='schema'&&!is_array($s[$k]??null))throw new RuntimeException('Schemafout.');$now=time();foreach(['sessions','challenges','limits']as$k)foreach($s[$k]as$id=>$v)if(($v['expires']??0)<$now)unset($s[$k][$id]);$s['audit']=array_slice($s['audit'],-2000);$result=$fn($s);$raw=json_encode($s,JSON_THROW_ON_ERROR|JSON_UNESCAPED_UNICODE);if(strlen($raw)>10*1024*1024)throw new RuntimeException('Opslaglimiet.');srn_atomic($f,srn_encrypt($raw,$c));if(is_array($result)&&isset($result['_purge'])){foreach($result['_purge']as$fid)if(preg_match('/^[a-f0-9]{32}$/D',$fid))@unlink($c['dir'].'/files/'.$fid.'.bin');unset($result['_purge']);}return $result;}finally{flock($lock,LOCK_UN);fclose($lock);}
}
function srn_hash(string $s,array $c): string {return hash_hmac('sha256',$s,$c['keyBytes']);}
function srn_limit(array &$s,string $key,int $max,int $window): bool {$now=time();if(!isset($s['limits'][$key])){if(count($s['limits'])>=5000)return false;$s['limits'][$key]=['n'=>0,'expires'=>$now+$window];}$s['limits'][$key]['n']++;return $s['limits'][$key]['n']<=$max;}
function srn_email(mixed $v): string {return is_string($v)&&strlen($v)<=254&&!preg_match('/[\r\n\x00]/',$v)&&filter_var($v,FILTER_VALIDATE_EMAIL)?strtolower(trim($v)):'';}
function srn_text(mixed $v,int $n=200): string {if(!is_string($v))return '';$clean=preg_replace('/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/','',$v);return preg_match('/^.{0,'.max(0,$n).'}/us',$clean,$m)?$m[0]:'';}
function srn_date(mixed $v): string {if(!is_string($v)||!preg_match('/^\d{4}-\d{2}-\d{2}$/D',$v))return '';$d=DateTimeImmutable::createFromFormat('!Y-m-d',$v,new DateTimeZone('Europe/Amsterdam'));return $d&&$d->format('Y-m-d')===$v?$v:'';}
function srn_session(array &$s,string $token): ?array {return $s['sessions'][hash('sha256',$token)]??null;}
function srn_new_session(array &$s,?string $account=null,?string $contact=null): array {if(count($s['sessions'])>=2000)throw new RuntimeException('Sessielimiet bereikt.');$token=bin2hex(random_bytes(32));$csrf=bin2hex(random_bytes(32));$s['sessions'][hash('sha256',$token)]=['account'=>$account,'contact'=>$contact,'csrf'=>$csrf,'created'=>time(),'authAt'=>$account||$contact?time():0,'expires'=>time()+1800];return ['token'=>$token,'csrf'=>$csrf];}
function srn_user(array $s,?array $session): ?array {return isset($session['account'])?($s['accounts'][$session['account']]??null):null;}
function srn_public_user(?array $u,array $c): ?array {if(!$u)return null;$staff=($c['staff_enabled']??false)===true?($c['staff'][$u['email']]??null):null;return ['id'=>$u['id'],'email'=>$u['email'],'role'=>$staff['role']??'consumer','entity'=>$staff['entity']??null];}
function srn_queue(array &$s,string $to,string $type,string $text,string $idempotency,array $meta=[]): void {foreach($s['outbox']as$v)if(($v['key']??'')===$idempotency)return;if(count($s['outbox'])>1000)throw new RuntimeException('Mailwachtrij vol.');$id=srn_id();$s['outbox'][$id]=['id'=>$id,'to'=>$to,'type'=>$type,'text'=>$text,'key'=>$idempotency,'created'=>time(),'expires'=>time()+($type==='otp'?600:86400),'attempts'=>0,'state'=>'queued','meta'=>$meta];}
function srn_audit(array &$s,string $action,string $actor,string $object): void {$s['audit'][]=['at'=>gmdate('c'),'action'=>$action,'actor'=>$actor,'object'=>$object];}
function srn_plan(array $input): array {
 if(($input['schemaVersion']??null)!==3||($input['app']??'')!=='SubsidieReadyPlan'||!is_array($input['projects']??null)||count($input['projects'])!==1)throw new InvalidArgumentException('Bewaar één geldig project per verzoek.');
 $p=$input['projects'][0];if(!is_array($p)||!is_string($p['id']??null)||!preg_match('/^[a-zA-Z0-9_-]{8,64}$/D',$p['id']))throw new InvalidArgumentException('Ongeldig project-ID.');
 if(($p['demo']??false)===true)throw new InvalidArgumentException('Voorbeeldprojecten worden niet online bewaard.');
 $out=['id'=>$p['id'],'title'=>srn_text($p['title']??'',100),'role'=>in_array($p['role']??'', ['owner','tenant','landlord','vve','business','unknown'],true)?$p['role']:'unknown','area'=>in_array($p['area']??'', ['m29','other','unknown'],true)?$p['area']:'unknown','municipality'=>srn_text($p['municipality']??'',80),'created'=>srn_date($p['created']??''),'updated'=>date('Y-m-d'),'ruleVersion'=>srn_text($p['ruleVersion']??'',50),'demo'=>false,'measures'=>[]];
 $types=['warmtepomp','isolatie','zonnepanelen','pv_constructie','thuisbatterij','ventilatie','zonneboiler','warmtenet','koken'];$arr=$p['measures']??null;if(!is_array($arr)||count($arr)>12)throw new InvalidArgumentException('Ongeldige maatregelen.');$ids=[];
 $selects=['insulation'=>['spouw','gevel','vloer','bodem','dak','zolder','hrpp','triple','vacuum'],'building'=>['before2019','permit2018','new','unknown'],'combination'=>['none','insulation','pump','solarheat','heatnet','ventilation','unknown'],'pvVat'=>['zero','paid21','mixed','unknown']];
 foreach(['professional','extension','monument','newFrames','ufFoam','kor','trade','ems','dynamic','sameName','payout','atHome','integratedNewbuild','buildingDelivery','previousInsulation','mixedPrivate']as$key)$selects[$key]=['yes','no','unknown'];
 foreach($arr as$m){if(!is_array($m)||!in_array($m['type']??'',$types,true)||!is_string($m['id']??null)||!preg_match('/^[a-zA-Z0-9_-]{8,64}$/D',$m['id'])||isset($ids[$m['id']]))throw new InvalidArgumentException('Ongeldige maatregel.');$ids[$m['id']]=true;$o=['id'=>$m['id'],'type'=>$m['type'],'title'=>srn_text($m['title']??'',100),'stage'=>in_array($m['stage']??'', ['planning','ordered','installed','submitted'],true)?$m['stage']:'planning','dates'=>[],'details'=>[],'checks'=>[],'checkFingerprint'=>srn_text($m['checkFingerprint']??'',30),'ruleVersion'=>srn_text($m['ruleVersion']??'',50)];foreach(['ordered','installed','invoice','paid','firstGlass','submitted']as$k)$o['dates'][$k]=srn_date($m['dates'][$k]??'');foreach($selects as$k=>$vals)$o['details'][$k]=in_array($m['details'][$k]??'',$vals,true)?$m['details'][$k]:'unknown';foreach(['area'=>12,'rd'=>12,'uValue'=>12,'gross'=>16,'code'=>80,'product'=>120,'notes'=>1500]as$k=>$n)$o['details'][$k]=srn_text($m['details'][$k]??'',$n);foreach(array_slice(is_array($m['checks']??null)?$m['checks']:[],0,40,true)as$k=>$v)if(preg_match('/^[a-z][a-z0-9_-]{0,39}$/D',(string)$k)&&$v===true)$o['checks'][$k]=true;$out['measures'][]=$o;}
 return ['app'=>'SubsidieReadyPlan','schemaVersion'=>3,'ruleVersion'=>SRN_RULE,'projects'=>[$out]];
}
function srn_owned(array $s,?array $u,string $id): ?array {$p=$s['projects'][$id]??null;return $p&&$u&&$p['owner']===$u['id']?$p:null;}
function srn_staff(?array $u,array $c): ?array {if(!$u||($c['staff_enabled']??false)!==true)return null;$r=$c['staff'][$u['email']]??null;return is_array($r)&&in_array($r['role']??'', ['sales_agent','sales_manager'],true)&&is_string($r['entity']??null)?$r:null;}
function srn_lead_view(array $l): array {return array_intersect_key($l,array_flip(['id','entity','receiver','topic','name','email','phone','channel','area','timeline','note','status','assigned','created','updated','contactText','copyVersion','contactRequested','activities']));}
function srn_handle(array $c,string $action,array $in,string $token,string $csrf,string $ip): array {
 return srn_tx($c,function(&$s)use($c,$action,$in,$token,$csrf,$ip){
  $session=srn_session($s,$token);$u=srn_user($s,$session);$ipKey=srn_hash(gmdate('Y-m-d').'|'.$ip,$c);
  if($action==='bootstrap'){
   if(!$session){if(!srn_limit($s,'bootstrap:'.$ipKey,80,600))return srn_error('Te veel verzoeken.',429);$new=srn_new_session($s);$session=srn_session($s,$new['token']);}else$new=['token'=>$token,'csrf'=>$session['csrf']];
   $dest=[];if(($c['leads_enabled']??false)===true&&($c['mode']==='local'||($c['mail_ready']??false)===true))foreach($c['destinations']??[]as$id=>$d)if(($d['enabled']??false)===true)$dest[]=['id'=>$id,'name'=>$d['name'],'topics'=>$d['topics'],'privacy'=>$d['privacy']];
   return ['mode'=>$c['mode'],'accounts'=>($c['accounts_enabled']??false)===true&&($c['mode']==='local'||($c['mail_ready']??false)===true),'vault'=>($c['vault_enabled']??false)===true,'leads'=>count($dest)>0,'controller'=>$c['controller'],'contact'=>$c['contact'],'destinations'=>$dest,'user'=>srn_public_user($u,$c),'csrf'=>$new['csrf'],'_cookie'=>$new['token'],'message'=>$c['mode']==='local'?'Lokale testserver: alleen fictieve gegevens, e-mails staan in de private testpostbus.':'Afgeschermde staging; nog geen productieacceptatie.'];
  }
  if(!$session||!hash_equals($session['csrf'],$csrf))return srn_error('Sessie verlopen. Vernieuw en probeer opnieuw.',403);
  if(!srn_limit($s,'requests:'.$ipKey,300,300))return srn_error('Te veel verzoeken.',429);
  $sessionKey=hash('sha256',$token);$s['sessions'][$sessionKey]['expires']=min($session['created']+28800,time()+1800);
  if($action==='auth-start'){
   if($c['mode']!=='local'&&($c['mail_ready']??false)!==true)return srn_error('Transactionele mail is nog niet vrijgegeven.',503);
   $email=srn_email($in['email']??null);$purpose=$in['purpose']??'account';if(!$email||!in_array($purpose,['account','requests'],true))return srn_error('Vul een geldig e-mailadres in.');
   if($purpose==='account'&&(($c['accounts_enabled']??false)!==true||($in['serviceAccepted']??false)!==true))return srn_error('Accountdienst niet beschikbaar of niet gekozen.',503);
   if($purpose==='requests'&&($c['leads_enabled']??false)!==true)return srn_error('Aanvragen niet beschikbaar.',503);
   $h=srn_hash($email,$c);$allowed=srn_limit($s,'mail:'.$h,3,900)&&srn_limit($s,'mailip:'.$ipKey,12,900);$id=srn_id();
   if($allowed){foreach($s['challenges']as$k=>$ch)if($ch['emailHash']===$h&&$ch['purpose']===$purpose)unset($s['challenges'][$k]);$code=(string)random_int(10000000,99999999);$s['challenges'][$id]=['email'=>$email,'emailHash'=>$h,'code'=>srn_hash($id.'|'.$code,$c),'purpose'=>$purpose,'session'=>$sessionKey,'attempts'=>0,'expires'=>time()+600];srn_queue($s,$email,'otp',"Je SubsidieReady-code is: $code\nGeldig voor 10 minuten. Alleen gebruiken voor je eigen verzoek. Geen account of nieuwsbrief aangevraagd? Negeer dit bericht.",'otp:'.$id);}
   return ['accepted'=>true,'challenge'=>$id,'message'=>'Een code is aangevraagd. Controleer je inbox; bij teveel verzoeken wordt geen nieuwe mail verstuurd.'];
  }
  if($action==='auth-verify'){
   $id=srn_text($in['challenge']??'',64);$ch=$s['challenges'][$id]??null;$code=srn_text($in['code']??'',12);
   if(!$ch||$ch['session']!==$sessionKey||$ch['attempts']>=5)return srn_error('Code ongeldig of verlopen.',401);$s['challenges'][$id]['attempts']++;
   if(!preg_match('/^\d{8}$/D',$code)||!hash_equals($ch['code'],srn_hash($id.'|'.$code,$c)))return srn_error('Code ongeldig of verlopen.',401);
   unset($s['challenges'][$id]);$aid=null;if($ch['purpose']==='account'){
    foreach($s['accounts']as$a)if($a['emailHash']===$ch['emailHash']){$aid=$a['id'];break;}
    if(!$aid){if(count($s['accounts'])>=200)return srn_error('Pilotcapaciteit bereikt.',503);$aid=srn_id();$s['accounts'][$aid]=['id'=>$aid,'email'=>$ch['email'],'emailHash'=>$ch['emailHash'],'created'=>time(),'lastUsed'=>time(),'reminders'=>false];}
    $s['accounts'][$aid]['lastUsed']=time();
   }
   if($ch['purpose']==='requests'&&$u&&$u['emailHash']===$ch['emailHash'])$aid=$u['id'];$new=srn_new_session($s,$aid,$ch['emailHash']);unset($s['sessions'][$sessionKey]);return ['user'=>srn_public_user($aid?$s['accounts'][$aid]:null,$c),'requestsVerified'=>true,'csrf'=>$new['csrf'],'_cookie'=>$new['token']];
  }
  if($action==='logout'){unset($s['sessions'][$sessionKey]);return ['ok'=>true,'_clearCookie'=>true];}
  if($action==='projects-list'){if(!$u)return srn_error('Log in voor online plannen.',401);return ['projects'=>array_values(array_map(fn($p)=>['id'=>$p['id'],'revision'=>$p['revision'],'title'=>$p['data']['projects'][0]['title'],'updated'=>$p['updated']],array_filter($s['projects'],fn($p)=>$p['owner']===$u['id'])))];}
  if($action==='project-save'){
   if(!$u)return srn_error('Log in voor online plannen.',401);try{$data=srn_plan($in['data']??[]);}catch(InvalidArgumentException $e){return srn_error($e->getMessage());}$id=$data['projects'][0]['id'];$old=$s['projects'][$id]??null;
   if($old&&$old['owner']!==$u['id'])return srn_error('Project niet gevonden.',404);$rev=$in['revision']??null;if(!is_int($rev)||$rev!==($old['revision']??0))return srn_error('Dit plan is op een ander apparaat gewijzigd. Laad de nieuwste versie; er is niets overschreven.',409);
   if(!$old&&count(array_filter($s['projects'],fn($p)=>$p['owner']===$u['id']))>=8)return srn_error('Maximaal acht online projecten.');
   $s['projects'][$id]=['id'=>$id,'owner'=>$u['id'],'revision'=>$rev+1,'updated'=>gmdate('c'),'data'=>$data];srn_audit($s,'project_save',$u['id'],$id);return ['id'=>$id,'revision'=>$rev+1,'data'=>$data];
  }
  if(in_array($action,['project-get','project-delete','files-list'],true)){
   $id=srn_text($in['id']??'',64);$p=srn_owned($s,$u,$id);if(!$p)return srn_error('Project niet gevonden.',404);
   if($action==='project-get')return ['data'=>$p['data'],'revision'=>$p['revision']];
   if($action==='files-list')return ['files'=>array_values(array_map(fn($f)=>array_intersect_key($f,array_flip(['id','project','measure','name','mime','size','scan'])),array_filter($s['files'],fn($f)=>$f['project']===$id&&$f['owner']===$u['id'])))];
   if(($in['confirm']??'')!=='VERWIJDER')return srn_error('Bevestig het verwijderen.');$purge=[];unset($s['projects'][$id]);foreach($s['files']as$fid=>$f)if($f['project']===$id){unset($s['files'][$fid]);$purge[]=$fid;}foreach($s['reminders']as$rid=>$r)if($r['project']===$id)unset($s['reminders'][$rid]);srn_audit($s,'project_delete',$u['id'],$id);return ['ok'=>true,'_purge'=>$purge];
  }
  if($action==='reminder-set'){if(!$u)return srn_error('Inloggen vereist.',401);$p=srn_owned($s,$u,srn_text($in['project']??'',64));$due=srn_date($in['date']??'');if(!$p||!$due||$due<date('Y-m-d')||$due>date('Y-m-d',time()+3*366*86400))return srn_error('Ongeldige herinnering.');$id=$p['id'].'|'.$due;if(($in['enabled']??false)!==true){unset($s['reminders'][$id]);return ['ok'=>true];}$s['reminders'][$id]=['id'=>$id,'owner'=>$u['id'],'project'=>$p['id'],'date'=>$due,'created'=>time(),'sent'=>false];return ['ok'=>true];}
  if($action==='reminders-off'){if(!$u)return srn_error('Inloggen vereist.',401);foreach($s['reminders']as$id=>$r)if($r['owner']===$u['id'])unset($s['reminders'][$id]);return ['ok'=>true];}
  if($action==='account-export'){if(!$u)return srn_error('Inloggen vereist.',401);return ['account'=>['email'=>$u['email'],'created'=>$u['created']],'projects'=>array_values(array_map(fn($p)=>$p['data'],array_filter($s['projects'],fn($p)=>$p['owner']===$u['id']))),'files'=>array_values(array_map(fn($f)=>array_intersect_key($f,array_flip(['id','project','measure','name','mime','size'])),array_filter($s['files'],fn($f)=>$f['owner']===$u['id']))),'note'=>'Bestanden afzonderlijk downloaden. Geen andere gebruikersdata.' ];}
  if($action==='account-delete'){
   if(!$u||time()-($session['authAt']??0)>600)return srn_error('Log opnieuw in om je account te verwijderen.',401);if(($in['confirm']??'')!=='VERWIJDER')return srn_error('Bevestig verwijderen.');
   $purge=[];foreach($s['files']as$id=>$f)if($f['owner']===$u['id']){unset($s['files'][$id]);$purge[]=$id;}
   foreach(['projects','reminders']as$k)foreach($s[$k]as$id=>$v)if($v['owner']===$u['id'])unset($s[$k][$id]);
   foreach($s['leads']as$id=>$l)if($l['emailHash']===$u['emailHash']){foreach(['name','email','phone','area','note']as$k)$s['leads'][$id][$k]='';$s['leads'][$id]['status']='withdrawn';$s['leads'][$id]['activities']=[];}
   foreach($s['sessions']as$id=>$ss)if(($ss['account']??null)===$u['id']||($ss['contact']??null)===$u['emailHash'])unset($s['sessions'][$id]);foreach($s['challenges']as$id=>$v)if($v['emailHash']===$u['emailHash'])unset($s['challenges'][$id]);foreach($s['outbox']as$id=>$v)if($v['to']===$u['email'])unset($s['outbox'][$id]);$s['audit']=array_values(array_filter($s['audit'],fn($a)=>$a['actor']!==$u['id']));unset($s['accounts'][$u['id']]);return ['ok'=>true,'_clearCookie'=>true,'_purge'=>$purge];
  }
  if($action==='lead-create'){
   if($c['mode']!=='local'&&($c['mail_ready']??false)!==true)return srn_error('Contactverificatie is nog niet beschikbaar.',503);
   if(($c['leads_enabled']??false)!==true)return srn_error('Adviesaanvragen zijn nog niet geactiveerd.',503);$entity=srn_text($in['destination']??'',40);$dest=$c['destinations'][$entity]??null;if(!$dest||($dest['enabled']??false)!==true)return srn_error('Deze ontvanger is niet beschikbaar.');
   $allowed=['destination','topic','name','email','phone','channel','area','timeline','note','contactRequested','requestId'];if(array_diff(array_keys($in),$allowed))return srn_error('Niet-toegestane aanvraagvelden.');
   $email=srn_email($in['email']??null);$channel=$in['channel']??'';$name=srn_text($in['name']??'',100);$phone=srn_text($in['phone']??'',30);$topic=srn_text($in['topic']??'',50);$requestId=srn_text($in['requestId']??'',64);
   if(!$email||!$name||!in_array($channel,['email','phone'],true)||($in['contactRequested']??false)!==true||!in_array($topic,$dest['topics'],true)||!preg_match('/^[a-zA-Z0-9_-]{8,64}$/D',$requestId))return srn_error('Vul de aanvraag en je contactkeuze volledig in.');if($channel==='phone'&&!preg_match('/^\+?[0-9 ()-]{9,22}$/D',$phone))return srn_error('Vul een geldig telefoonnummer in.');$h=srn_hash($email,$c);
   foreach($s['leads']as$l)if($l['requestId']===$requestId&&$l['session']===$sessionKey)return ['accepted'=>true,'id'=>$l['id'],'message'=>'Aanvraag bewaard. Verifieer je e-mailadres via Mijn aanvragen.'];
   if(!srn_limit($s,'lead:'.$h,3,3600)||!srn_limit($s,'leadip:'.$ipKey,10,3600))return srn_error('Te veel aanvragen. Probeer later opnieuw.',429);if(count($s['leads'])>=500)return srn_error('Pilotcapaciteit bereikt.',503);
   $id=srn_id();$s['leads'][$id]=['id'=>$id,'entity'=>$entity,'receiver'=>$dest['name'],'topic'=>$topic,'name'=>$name,'email'=>$email,'emailHash'=>$h,'phone'=>$channel==='phone'?$phone:'','channel'=>$channel,'area'=>preg_match('/^\d{4}$/D',$in['area']??'')?$in['area']:'','timeline'=>in_array($in['timeline']??'', ['now','3months','later','orientation'],true)?$in['timeline']:'orientation','note'=>srn_text($in['note']??'',500),'status'=>'pending','assigned'=>null,'created'=>gmdate('c'),'updated'=>gmdate('c'),'copyVersion'=>'2026-11-14-request-v1','contactRequested'=>true,'contactText'=>'Ik vraag '.$dest['name'].' mij per '.$channel.' te benaderen over '.$topic.'. Mijn subsidiedossier wordt niet gedeeld. Geen nieuwsbriefinschrijving.','requestId'=>$requestId,'session'=>$sessionKey,'activities'=>[]];
   return ['accepted'=>true,'id'=>$id,'message'=>'Aanvraag bewaard, nog niet naar sales. Verifieer je e-mailadres via Mijn aanvragen.'];
  }
  if($action==='requests-list'){
   $h=$session['contact']??null;if(!$h)return srn_error('Verifieer je e-mailadres.',401);
   foreach($s['leads']as$id=>$l)if($l['emailHash']===$h&&$l['status']==='pending'){$s['leads'][$id]['status']='new';$s['leads'][$id]['updated']=gmdate('c');srn_audit($s,'lead_verified','consumer',$id);}
   return ['requests'=>array_values(array_map('srn_lead_view',array_filter($s['leads'],fn($l)=>$l['emailHash']===$h)))];
  }
  if($action==='request-revoke'){$id=srn_text($in['id']??'',64);$l=$s['leads'][$id]??null;if(!$l||$l['emailHash']!==($session['contact']??''))return srn_error('Aanvraag niet gevonden.',404);$s['leads'][$id]['status']='withdrawn';$s['leads'][$id]['updated']=gmdate('c');srn_audit($s,'lead_withdrawn','consumer',$id);return ['ok'=>true];}
  if(in_array($action,['sales-list','sales-update','sales-export'],true)){
   $staff=srn_staff($u,$c);if(!$staff)return srn_error('Geen toegang tot sales.',403);$can=fn($l)=>$l['entity']===$staff['entity']&&$l['status']!=='pending'&&($staff['role']==='sales_manager'||$l['assigned']===$u['email']);
   if($action==='sales-list'||$action==='sales-export'){if($action==='sales-export'&&$staff['role']!=='sales_manager')return srn_error('Export alleen voor salesmanager.',403);$ls=array_values(array_map('srn_lead_view',array_filter($s['leads'],$can)));$counts=[];foreach($ls as$l)$counts[$l['status']]=($counts[$l['status']]??0)+1;srn_audit($s,$action,$u['id'],$staff['entity']);return ['leads'=>$ls,'counts'=>$counts,'definitions'=>'Unieke contactgeverifieerde adviesaanvragen. Geen bezoekers, dossiers, omzet of conversiepercentages.','staff'=>array_keys(array_filter($c['staff']??[],fn($v)=>$v['entity']===$staff['entity']))];}
   $id=srn_text($in['id']??'',64);$l=$s['leads'][$id]??null;if(!$l||!$can($l))return srn_error('Aanvraag niet gevonden.',404);if($l['status']==='withdrawn')return srn_error('Ingetrokken aanvraag mag niet worden heropend.',409);
   $allowedStatus=['new','qualified','contacted','appointment','quote','won','lost','invalid'];$status=$in['status']??$l['status'];if(!in_array($status,$allowedStatus,true))return srn_error('Ongeldige status.');
   if(isset($in['assigned'])){if($staff['role']!=='sales_manager')return srn_error('Alleen manager kan toewijzen.',403);$dest=$c['staff'][$in['assigned']]??null;if(!$dest||$dest['entity']!==$staff['entity'])return srn_error('Onbevoegde toewijzing.',403);$s['leads'][$id]['assigned']=$in['assigned'];}
   $s['leads'][$id]['status']=$status;$s['leads'][$id]['updated']=gmdate('c');$activity=['at'=>gmdate('c'),'status'=>$status,'actor'=>$u['id'],'note'=>srn_text($in['note']??'',400)];$s['leads'][$id]['activities']=array_slice([...$l['activities'],$activity],-30);srn_audit($s,'lead_update',$u['id'],$id);return ['ok'=>true];
  }
  if($action==='file-delete'){if(!$u)return srn_error('Inloggen vereist.',401);$id=srn_text($in['id']??'',64);$f=$s['files'][$id]??null;if(!$f||$f['owner']!==$u['id'])return srn_error('Bestand niet gevonden.',404);if(!isset($s['projects'][$f['project']])||($in['revision']??null)!==$s['projects'][$f['project']]['revision'])return srn_error('Project gewijzigd. Herlaad vóór je een bijlage verwijdert.',409);unset($s['files'][$id]);$revision=srn_evidence_changed($s,$f['project'],$f['measure']);return ['ok'=>true,'project'=>$f['project'],'measure'=>$f['measure'],'revision'=>$revision,'_purge'=>[$id]];}
  return srn_error('Onbekende actie.',404);
 });
}
function srn_evidence_changed(array &$s,string $project,string $measure): int {
 foreach($s['projects'][$project]['data']['projects'][0]['measures']as &$m)if($m['id']===$measure){$m['checks']=[];$m['checkFingerprint']='';}unset($m);
 $s['projects'][$project]['revision']++;$s['projects'][$project]['updated']=gmdate('c');return $s['projects'][$project]['revision'];
}
function srn_file_upload(array $c,array $in,string $token,string $csrf,array $file): array {
 if(($c['vault_enabled']??false)!==true)return srn_error('Documentenkluis niet geactiveerd.',503);
 $authorized=srn_tx($c,function(&$s)use($token,$csrf,$in){$ss=srn_session($s,$token);$u=srn_user($s,$ss);return $u&&hash_equals($ss['csrf'],$csrf)&&srn_owned($s,$u,srn_text($in['project']??'',64));});if(!$authorized)return srn_error('Inloggen of projecttoegang ontbreekt.',403);
 if(($file['error']??UPLOAD_ERR_NO_FILE)!==UPLOAD_ERR_OK||!is_file($file['tmp_name']??'')||($file['size']??0)<1||$file['size']>10*1024*1024)return srn_error('Kies een bestand van 1 byte tot 10 MB.');
 $bytes=file_get_contents($file['tmp_name']);if($bytes===false||strlen($bytes)!==(int)$file['size'])return srn_error('Upload onvolledig.');$mime=(new finfo(FILEINFO_MIME_TYPE))->buffer($bytes);$good=($mime==='application/pdf'&&str_starts_with($bytes,'%PDF-')&&str_contains(substr($bytes,-2048),'%%EOF'))||in_array($mime,['image/png','image/jpeg'],true)&&@getimagesizefromstring($bytes)!==false;
 if(!$good)return srn_error('Alleen een herkenbare PDF, PNG of JPEG.');
 $scan='not_scanned';if($c['mode']==='local'&&($c['local_test_files']??false)===true)$scan='local_test_only';else{$scanner=$c['scanner']??'';if(!is_string($scanner)||!is_executable($scanner)||!in_array(basename($scanner),['clamscan'],true))return srn_error('Malwarecontrole niet beschikbaar; upload gestopt.',503);$pipes=[];$proc=proc_open([$scanner,'--no-summary','--',$file['tmp_name']],[0=>['pipe','r'],1=>['file','/dev/null','a'],2=>['file','/dev/null','a']],$pipes);if(!is_resource($proc))return srn_error('Controle niet beschikbaar.',503);fclose($pipes[0]);$start=microtime(true);do{$st=proc_get_status($proc);if(!$st['running'])break;usleep(100000);}while(microtime(true)-$start<15);if($st['running']){proc_terminate($proc);proc_close($proc);return srn_error('Controle duurt te lang.',503);} $exit=$st['exitcode'];proc_close($proc);if($exit!==0)return srn_error('Bestand niet vrijgegeven door controle.',422);$scan='scanned';}
 return srn_tx($c,function(&$s)use($c,$in,$token,$csrf,$file,$bytes,$mime,$scan){$ss=srn_session($s,$token);$u=srn_user($s,$ss);if(!$u||!hash_equals($ss['csrf'],$csrf))return srn_error('Inloggen vereist.',401);if(($in['onlineChoice']??'')!=='yes')return srn_error('Kies expliciet voor online bewaren.');$p=srn_owned($s,$u,srn_text($in['project']??'',64));$mid=srn_text($in['measure']??'',64);if(!$p||!array_filter($p['data']['projects'][0]['measures'],fn($m)=>$m['id']===$mid))return srn_error('Maatregel niet gevonden.',404);if((string)($in['revision']??'')!==(string)$p['revision'])return srn_error('Project gewijzigd. Herlaad vóór upload.',409);$mine=array_filter($s['files'],fn($f)=>$f['owner']===$u['id']);if(count($mine)>=30||array_sum(array_column($mine,'size'))+strlen($bytes)>50*1024*1024)return srn_error('Documentenlimiet bereikt.');$id=srn_id();$path=$c['dir'].'/files';if(!is_dir($path))mkdir($path,0700);if(is_link($path))throw new RuntimeException('Ongeldig pad.');srn_atomic($path.'/'.$id.'.bin',srn_encrypt($u['id'].'|'.$id.'|'.$bytes,$c));$s['files'][$id]=['id'=>$id,'owner'=>$u['id'],'project'=>$p['id'],'measure'=>$mid,'name'=>preg_replace('/[^\pL\pN ._()\-]/u','_',srn_text(basename(str_replace('\\','/',$file['name'])),120)),'mime'=>$mime,'size'=>strlen($bytes),'sha256'=>hash('sha256',$bytes),'scan'=>$scan,'created'=>time()];return ['revision'=>srn_evidence_changed($s,$p['id'],$mid),'file'=>array_intersect_key($s['files'][$id],array_flip(['id','project','measure','name','mime','size','scan']))];});
}
function srn_file_get(array $c,string $token,string $csrf,string $id): array {return srn_tx($c,function(&$s)use($c,$token,$csrf,$id){$ss=srn_session($s,$token);$u=srn_user($s,$ss);$f=$s['files'][$id]??null;if(!$u||!hash_equals($ss['csrf'],$csrf)||!$f||$f['owner']!==$u['id'])return srn_error('Bestand niet gevonden.',404);$path=$c['dir'].'/files/'.$id.'.bin';if(!is_file($path)||is_link($path))return srn_error('Bestand niet beschikbaar.',503);$raw=srn_decrypt((string)file_get_contents($path),$c);$prefix=$u['id'].'|'.$id.'|';if(!str_starts_with($raw,$prefix))throw new RuntimeException('Bestandsintegriteit.');$bytes=substr($raw,strlen($prefix));if(!hash_equals($f['sha256'],hash('sha256',$bytes)))throw new RuntimeException('Bestandsintegriteit.');return ['_bytes'=>$bytes,'mime'=>$f['mime'],'name'=>$f['name']];});}
