<?php
declare(strict_types=1);
require dirname(__DIR__).'/server/bootstrap.php';
if ($_SERVER['REQUEST_METHOD'] !== 'GET') sr_json(['error'=>'Methode niet toegestaan.'],405);
try {
    $c=sr_config();
    sr_json(['service'=>'SubsidieReady','version'=>SR_VERSION,'analytics'=>($c['analytics_enabled']??false)===true,'operator'=>$c['operator'],'contact'=>$c['contact']]);
} catch (Throwable $e) {
    sr_json(['service'=>'SubsidieReady','version'=>SR_VERSION,'analytics'=>false]);
}
