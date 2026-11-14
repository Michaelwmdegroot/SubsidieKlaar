<?php
declare(strict_types=1);
// PHP development server only. Never deploy this as a public endpoint.
if(PHP_SAPI!=='cli-server'){http_response_code(404);exit;}
$root=realpath(dirname(__DIR__,2));$p=rawurldecode(parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH)??'/');
header('X-Robots-Tag: noindex, nofollow');header('X-Content-Type-Options: nosniff');header('Referrer-Policy: no-referrer');header('Cache-Control: no-store');
$ht=file_get_contents($root.'/.htaccess');preg_match('/Content-Security-Policy "([^"]+)"/',$ht,$m);$csp=str_replace('; upgrade-insecure-requests','',$m[1]??"default-src 'self'");header('Content-Security-Policy: '.$csp);
if(str_contains($p,"\0")||str_contains($p,'\\')||preg_match('~(^|/)\.|^/(?:server|scripts|tests|templates|docs|concept|qa|dist|vendor/.*LICENSE|AGENTS|README|package)(?:/|\.|$)~',$p)||preg_match('/\.(?:cjs|md|yml|json\.lock|env)$/i',$p)){http_response_code(404);echo 'Niet gevonden';return true;}
$f=realpath($root.$p);if($f&&is_dir($f)){$f=is_file($f.'/index.html')?$f.'/index.html':$f.'/index.php';}
if(!$f||!str_starts_with($f,$root.'/')||!is_file($f)){http_response_code(404);readfile($root.'/404.html');return true;}
if(str_ends_with($f,'.php')){if(!str_starts_with($p,'/api/')&&!str_starts_with($p,'/admin/')){http_response_code(404);return true;}require $f;return true;}
$types=['html'=>'text/html; charset=utf-8','js'=>'application/javascript; charset=utf-8','css'=>'text/css; charset=utf-8','json'=>'application/json','svg'=>'image/svg+xml','webp'=>'image/webp','ttf'=>'font/ttf','xml'=>'application/xml','txt'=>'text/plain'];$ext=pathinfo($f,PATHINFO_EXTENSION);if(!isset($types[$ext])){http_response_code(404);return true;}header('Content-Type: '.$types[$ext]);readfile($f);return true;
