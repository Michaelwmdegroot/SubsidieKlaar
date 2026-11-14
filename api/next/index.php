<?php
declare(strict_types=1);
require dirname(__DIR__,2).'/server/next/service.php';
header('Cache-Control: no-store, private');header('X-Robots-Tag: noindex, nofollow');header('X-Content-Type-Options: nosniff');header('Referrer-Policy: no-referrer');header("Content-Security-Policy: default-src 'none'; frame-ancestors 'none'");header('Content-Type: application/json; charset=utf-8');
function finish(array $r): never {http_response_code($r['_status']??200);unset($r['_status']);echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR);exit;}
try{$c=srn_config();}catch(Throwable){finish(['_status'=>503,'error'=>'Online functies zijn niet geconfigureerd. De lokale werkbanken blijven beschikbaar.','configured'=>false]);}
$local=$c['mode']==='local';$remote=$_SERVER['REMOTE_ADDR']??'';
if($local&&$remote!=='127.0.0.1'&&$remote!=='::1')finish(['_status'=>403,'error'=>'Alleen loopback.']);
if(!$local&&($_SERVER['HTTPS']??'')!=='on'&&(string)($_SERVER['SERVER_PORT']??'')!=='443')finish(['_status'=>426,'error'=>'HTTPS vereist.']);
$host=parse_url($c['origin'],PHP_URL_HOST).(parse_url($c['origin'],PHP_URL_PORT)?':'.parse_url($c['origin'],PHP_URL_PORT):'');if(($_SERVER['HTTP_HOST']??'')!==$host)finish(['_status'=>403,'error'=>'Verkeerde host.']);
if(($_SERVER['HTTP_SEC_FETCH_SITE']??'')==='cross-site')finish(['_status'=>403,'error'=>'Cross-site verzoek geweigerd.']);
$action=$_GET['action']??'';if(!is_string($action)||!preg_match('/^[a-z-]{2,32}$/D',$action))finish(['_status'=>404,'error'=>'Onbekende actie.']);
$method=$_SERVER['REQUEST_METHOD']??'';if(($action==='bootstrap'&&$method!=='GET')||($action!=='bootstrap'&&$method!=='POST'))finish(['_status'=>405,'error'=>'Methode niet toegestaan.']);
if($method==='POST'&&($_SERVER['HTTP_ORIGIN']??'')!==$c['origin'])finish(['_status'=>403,'error'=>'Origin geweigerd.']);
$cookie=$local?'SRNextLocal':'__Host-SRNext';$token=$_COOKIE[$cookie]??'';$csrf=$_SERVER['HTTP_X_CSRF_TOKEN']??'';if(!is_string($token)||!is_string($csrf))finish(['_status'=>403,'error'=>'Sessie geweigerd.']);
try{
 if($action==='file-upload'){if(!isset($_FILES['file'])||!is_uploaded_file($_FILES['file']['tmp_name']??''))finish(['_status'=>400,'error'=>'Upload ontbreekt of is ongeldig.']);$r=srn_file_upload($c,$_POST,$token,$csrf,$_FILES['file']??[]);}
 else{$in=[];if($method==='POST'){if(strtolower(trim(explode(';',$_SERVER['CONTENT_TYPE']??'')[0]))!=='application/json')finish(['_status'=>415,'error'=>'JSON vereist.']);$raw=file_get_contents('php://input',false,null,0,200001);if($raw===false||strlen($raw)>200000)finish(['_status'=>413,'error'=>'Verzoek te groot.']);$in=json_decode($raw,true,40,JSON_THROW_ON_ERROR);if(!is_array($in)||array_is_list($in)&&$in!==[])finish(['_status'=>400,'error'=>'Ongeldig verzoek.']);}
  if($action==='file-download')$r=srn_file_get($c,$token,$csrf,srn_text($in['id']??'',64));else$r=srn_handle($c,$action,$in,$token,$csrf,$remote);
 }
 if(isset($r['_cookie'])){setcookie($cookie,$r['_cookie'],['expires'=>0,'path'=>'/','secure'=>!$local,'httponly'=>true,'samesite'=>'Strict']);unset($r['_cookie']);}
 if(isset($r['_clearCookie'])){setcookie($cookie,'',['expires'=>time()-3600,'path'=>'/','secure'=>!$local,'httponly'=>true,'samesite'=>'Strict']);unset($r['_clearCookie']);}
 if(isset($r['_bytes'])){header('Content-Type: '.$r['mime']);header("Content-Disposition: attachment; filename=\"document\"; filename*=UTF-8''".rawurlencode($r['name']));echo $r['_bytes'];exit;}
 finish($r);
}catch(JsonException){finish(['_status'=>400,'error'=>'Ongeldige JSON.']);}catch(Throwable){finish(['_status'=>503,'error'=>'Deze functie is tijdelijk niet beschikbaar. Er is geen succes bevestigd.']);}
