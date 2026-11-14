<?php
declare(strict_types=1);
// Not a public endpoint. Secrets and mutable state must live outside the document root.
const SR_VERSION = '1.0.0';
const SR_EVENTS = ['visit','start','step0','step1','step2','step3','review','download','pdf','zip'];
date_default_timezone_set('Europe/Amsterdam');
function sr_headers(bool $json = false): void {
    header('Cache-Control: no-store, private');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('Referrer-Policy: no-referrer');
    header('X-Robots-Tag: noindex, nofollow');
    header("Content-Security-Policy: default-src 'none'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; form-action 'self'; base-uri 'none'; frame-ancestors 'none'");
    if ($json) header('Content-Type: application/json; charset=utf-8');
}
function sr_json(array $value, int $status = 200): never {
    sr_headers(true); http_response_code($status);
    echo json_encode($value, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR); exit;
}
function sr_private_dir(): string {
    $root = realpath(dirname(__DIR__));
    $candidate = getenv('SUBSIDIEREADY_PRIVATE_DIR') ?: dirname($root) . '/subsidieready-private';
    $resolved = realpath($candidate);
    if ($resolved === false || !is_dir($resolved) || $resolved === $root || str_starts_with($resolved, $root . DIRECTORY_SEPARATOR)) {
        throw new RuntimeException('Beheer is niet geconfigureerd.');
    }
    return $resolved;
}
function sr_config(): array {
    $dir = sr_private_dir();
    $file = $dir . '/config.php';
    if (!is_file($file) || is_link($file)) throw new RuntimeException('Beheer is niet geconfigureerd.');
    $c = require $file;
    if (!is_array($c) || ($c['base_url'] ?? '') !== 'https://subsidieready.nl' ||
        !is_string($c['password_hash'] ?? null) || strlen($c['password_hash']) < 40 ||
        !is_string($c['secret'] ?? null) || strlen($c['secret']) < 64 ||
        !is_string($c['operator'] ?? null) || trim($c['operator']) === '' || strlen($c['operator']) > 200 ||
        !filter_var($c['contact'] ?? '', FILTER_VALIDATE_EMAIL)) {
        throw new RuntimeException('Beheerconfiguratie is ongeldig.');
    }
    $c['dir'] = $dir; return $c;
}
function sr_test_http(): bool {
    return getenv('SR_TEST_HTTP') === '1' && in_array($_SERVER['REMOTE_ADDR'] ?? '', ['127.0.0.1','::1'], true);
}
function sr_tls(): bool { return ($_SERVER['HTTPS'] ?? '') === 'on' || ($_SERVER['SERVER_PORT'] ?? '') === '443'; }
function sr_origin(array $c): string {
    if (sr_test_http()) {
        $test = getenv('SR_TEST_ORIGIN') ?: '';
        if (preg_match('~^http://127\.0\.0\.1:[0-9]{2,5}$~D', $test)) return $test;
    }
    return $c['base_url'];
}
function sr_require_tls(): void {
    if (!sr_tls() && !sr_test_http()) sr_json(['error'=>'HTTPS is vereist.'], 426);
}
function sr_origin_check(array $c): void {
    if (($_SERVER['HTTP_ORIGIN'] ?? '') !== sr_origin($c)) sr_json(['error'=>'Verzoek geweigerd.'], 403);
}
function sr_dir(string $path): void {
    if (!is_dir($path) && !mkdir($path,0700,true) && !is_dir($path)) throw new RuntimeException('Opslag is niet beschikbaar.');
}
function sr_json_transaction(string $file, callable $change): array {
    sr_dir(dirname($file));
    $lock = fopen($file . '.lock','c');
    if ($lock === false || !flock($lock, LOCK_EX)) throw new RuntimeException('Opslag is bezet.');
    chmod($file . '.lock',0600);
    $temp = null;
    try {
        $data = is_file($file) ? json_decode((string)file_get_contents($file),true,512,JSON_THROW_ON_ERROR) : [];
        if (!is_array($data)) throw new RuntimeException('Opslag is ongeldig.');
        $result = $change($data);
        $temp = tempnam(dirname($file),'.sr-');
        if ($temp === false) throw new RuntimeException('Opslag is niet beschikbaar.');
        chmod($temp,0600);
        if (file_put_contents($temp,json_encode($data,JSON_THROW_ON_ERROR),LOCK_EX) === false || !rename($temp,$file)) throw new RuntimeException('Opslaan mislukt.');
        return $result;
    } finally {
        if ($temp !== null && is_file($temp)) unlink($temp);
        flock($lock,LOCK_UN); fclose($lock);
    }
}
function sr_rate(array $c, string $category, int $limit, int $seconds): bool {
    $now = time();
    // Do not trust forwarded IP headers. Hash rotates daily and is only used for abuse limits.
    $id = $category . ':' . hash_hmac('sha256', date('Y-m-d') . '|' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'), $c['secret']);
    $result = sr_json_transaction($c['dir'].'/rate.json', function (&$data) use ($id,$limit,$seconds,$now) {
        foreach ($data as $key=>$entry) if (!is_array($entry) || ($entry['until'] ?? 0) <= $now) unset($data[$key]);
        if (!isset($data[$id]) && count($data) >= 5000) return ['allowed'=>false];
        $entry = $data[$id] ?? ['n'=>0,'until'=>$now+$seconds];
        $entry['n'] = min($limit+1,(int)$entry['n']+1); $data[$id] = $entry;
        return ['allowed'=>$entry['n'] <= $limit];
    });
    return $result['allowed'];
}
function sr_count(array $c, string $event): void {
    $date = date('Y-m-d');
    sr_json_transaction($c['dir'].'/stats/'.$date.'.json', function (&$data) use ($event) {
        $data[$event] = min(100000000,(int)($data[$event] ?? 0)+1); return [];
    });
    sr_prune($c);
}
function sr_prune(array $c): void {
    $cutoff = (new DateTimeImmutable('today'))->modify('-89 days')->format('Y-m-d');
    foreach (glob($c['dir'].'/stats/*.json') ?: [] as $file) {
        $date = basename($file,'.json');
        if (preg_match('/^\d{4}-\d{2}-\d{2}$/D',$date) && $date < $cutoff) { unlink($file); @unlink($file.'.lock'); }
    }
    // Also remove expired abuse identifiers when only an admin is active.
    $rate = $c['dir'].'/rate.json';
    if (is_file($rate)) sr_json_transaction($rate,function (&$data) {
        foreach ($data as $id=>$entry) if (($entry['until'] ?? 0) <= time()) unset($data[$id]);
        return [];
    });
}
function sr_stats(array $c): array {
    sr_prune($c); $rows=[]; $totals=array_fill_keys(SR_EVENTS,0);
    foreach (glob($c['dir'].'/stats/*.json') ?: [] as $file) {
        $date=basename($file,'.json'); if (!preg_match('/^\d{4}-\d{2}-\d{2}$/D',$date)) continue;
        $raw=json_decode((string)file_get_contents($file),true,512,JSON_THROW_ON_ERROR);
        if (!is_array($raw)) throw new RuntimeException('Statistieken kunnen niet worden gelezen.');
        $row=['date'=>$date];
        foreach (SR_EVENTS as $event) { $n=max(0,(int)($raw[$event] ?? 0));$row[$event]=$n;$totals[$event]+=$n; }
        $rows[]=$row;
    }
    return ['scope'=>'Toegestane, clientgestuurde gebeurtenissen. Geen unieke personen.','timezone'=>'Europe/Amsterdam','retention_days'=>90,'totals'=>$totals,'days'=>$rows];
}
function sr_escape(mixed $v): string { return htmlspecialchars((string)$v,ENT_QUOTES|ENT_SUBSTITUTE,'UTF-8'); }
function sr_session(array $c): void {
    sr_dir($c['dir'].'/sessions');
    ini_set('session.use_strict_mode','1'); ini_set('session.use_only_cookies','1');
    ini_set('session.gc_maxlifetime','1200'); ini_set('session.gc_probability','1');ini_set('session.gc_divisor','100');
    session_save_path($c['dir'].'/sessions'); session_name(sr_test_http()?'SRAdminTest':'__Host-SRAdmin');
    session_set_cookie_params(['lifetime'=>0,'path'=>'/','secure'=>!sr_test_http(),'httponly'=>true,'samesite'=>'Strict']);
    session_start();
    $now=time();
    if (isset($_SESSION['auth']) && ($now-($_SESSION['last']??0)>1200 || $now-($_SESSION['created']??0)>28800)) {
        $_SESSION=[];session_regenerate_id(true);
    }
    if (isset($_SESSION['auth'])) $_SESSION['last']=$now;
    if (!isset($_SESSION['csrf'])) $_SESSION['csrf']=bin2hex(random_bytes(32));
}
function sr_csrf(array $c): void {
    sr_origin_check($c);
    if (!is_string($_POST['csrf']??null) || !hash_equals($_SESSION['csrf'],$_POST['csrf'])) sr_json(['error'=>'Verzoek verlopen. Vernieuw de pagina.'],403);
}
