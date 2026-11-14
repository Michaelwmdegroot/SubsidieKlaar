<?php
declare(strict_types=1);
if(PHP_SAPI!=='cli'){http_response_code(404);exit;}
require dirname(__DIR__).'/server/bootstrap.php';
try{sr_prune(sr_config());fwrite(STDOUT,"Expired aggregates and rate-limit records removed.\n");}
catch(Throwable $e){fwrite(STDERR,"Private configuration or storage is unavailable.\n");exit(1);}
