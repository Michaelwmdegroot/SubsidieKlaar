<?php
declare(strict_types=1);
require dirname(__DIR__).'/server/bootstrap.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') sr_json(['error'=>'Methode niet toegestaan.'],405);
sr_require_tls();
try { $c=sr_config(); } catch (Throwable $e) { sr_json(['error'=>'Meting niet beschikbaar.'],503); }
if (($c['analytics_enabled']??false)!==true) sr_json(['error'=>'Meting niet geactiveerd.'],503);
sr_origin_check($c);
if (strtolower(trim(explode(';',$_SERVER['CONTENT_TYPE']??'')[0]))!=='application/json') sr_json(['error'=>'JSON vereist.'],415);
if ((int)($_SERVER['CONTENT_LENGTH']??0)>128) sr_json(['error'=>'Verzoek te groot.'],413);
$raw=file_get_contents('php://input',false,null,0,129);
if ($raw===false || strlen($raw)>128) sr_json(['error'=>'Verzoek te groot.'],413);
try { $body=json_decode($raw,true,4,JSON_THROW_ON_ERROR); } catch (Throwable $e) { sr_json(['error'=>'Ongeldig verzoek.'],400); }
if (!is_array($body) || array_keys($body)!==['event'] || !is_string($body['event']) || !in_array($body['event'],SR_EVENTS,true)) sr_json(['error'=>'Ongeldig verzoek.'],400);
try {
    if (!sr_rate($c,'event',120,60)) {header('Retry-After: 60');sr_json(['error'=>'Te veel verzoeken.'],429);}
    sr_count($c,$body['event']);sr_json(['accepted'=>true],202);
} catch (Throwable $e) { sr_json(['error'=>'Meting tijdelijk niet beschikbaar.'],503); }
