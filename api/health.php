<?php
declare(strict_types=1);
require dirname(__DIR__).'/server/bootstrap.php';
if ($_SERVER['REQUEST_METHOD']!=='GET') sr_json(['error'=>'Methode niet toegestaan.'],405);
sr_json(['service'=>'SubsidieReady','version'=>SR_VERSION,'status'=>'ok','document_processing'=>'browser-only']);
