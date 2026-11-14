<?php
declare(strict_types=1);
require dirname(__DIR__).'/server/bootstrap.php';
sr_headers();sr_require_tls();
try { $c=sr_config(); } catch (Throwable $e) {
    http_response_code(503);
    echo '<!doctype html><html lang="nl"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Beheer niet geactiveerd | SubsidieReady</title><link rel="stylesheet" href="/assets/style.css"><main class="reading"><h1>Beheer is nog niet geactiveerd.</h1><p>De documentenwerkbank werkt onafhankelijk van het beheer. Er is geen openbare registratie of standaardwachtwoord.</p><p>De eigenaar activeert beheer via de beveiligde hostingconsole.</p><a href="/">Naar SubsidieReady</a></main></html>';exit;
}
sr_session($c);$error='';
if ($_SERVER['REQUEST_METHOD']==='POST') {
    sr_csrf($c);
    if (($_POST['action']??'')==='logout') {
        $_SESSION=[];session_destroy();setcookie(session_name(),'', ['expires'=>time()-3600,'path'=>'/','secure'=>!sr_test_http(),'httponly'=>true,'samesite'=>'Strict']);
        header('Location: /admin/',true,303);exit;
    }
    try {
        if (!sr_rate($c,'login',10,900)) {http_response_code(429);header('Retry-After: 900');$error='Te veel pogingen. Probeer het later opnieuw.';}
        else {
            $password=$_POST['password']??'';
            $valid=is_string($password)&&strlen($password)<=256&&password_verify($password,$c['password_hash']);
            if ($valid) {
                session_regenerate_id(true);$_SESSION=['auth'=>true,'created'=>time(),'last'=>time(),'csrf'=>bin2hex(random_bytes(32))];
                header('Location: /admin/',true,303);exit;
            }
            http_response_code(401);$error='Inloggen is niet gelukt.';
        }
    } catch (Throwable $e) {http_response_code(503);$error='Beheer is tijdelijk niet beschikbaar.';}
} elseif ($_SERVER['REQUEST_METHOD']!=='GET') {http_response_code(405);exit;}
$auth=($_SESSION['auth']??false)===true;$stats=null;
if ($auth) {
    try {$stats=sr_stats($c);} catch (Throwable $e) {http_response_code(503);$error='Statistieken kunnen niet veilig worden gelezen. Er worden geen vervangende cijfers getoond.';}
    if (isset($_GET['export']) && $stats!==null) {
        header('Content-Disposition: attachment; filename="SubsidieReady-statistieken.json"');sr_json($stats);
    }
}
?><!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Beheer | SubsidieReady</title><link rel="icon" href="/assets/mark.svg"><link rel="stylesheet" href="/assets/style.css"></head><body><header class="site-header"><div class="container nav"><a class="brand" href="/">SubsidieReady <small>BEHEER</small></a><a href="/">Naar de website</a></div></header><main class="reading admin-reading"><div class="eyebrow">Afgeschermde beheeromgeving</div><h1><?= $auth?'Hoe wordt de tool gebruikt?':'Welkom terug.' ?></h1>
<?php if ($error):?><p class="info-box amber" role="alert"><?=sr_escape($error)?></p><?php endif;?>
<?php if (!$auth):?><p>Alleen voor de beheerder. Bezoekers hebben geen account nodig.</p><form method="post" class="admin-login"><input type="hidden" name="csrf" value="<?=sr_escape($_SESSION['csrf'])?>"><label class="field"><span>Beheerderswachtwoord</span><input type="password" name="password" required autocomplete="current-password" maxlength="256" autofocus></label><button class="btn btn-primary" type="submit">Inloggen</button></form>
<?php else:?><p>Alleen acties van bezoekers die toestemming gaven. Dit zijn <strong>gebeurtenissen, geen unieke personen</strong>. Demo-acties worden door de browser niet meegestuurd. Geen dossierinhoud, namen, adressen of bestandsnamen.</p><div class="info-box"><?=($c['analytics_enabled']??false)?'Optionele meting is geactiveerd.':'Meting staat uit. De tool blijft volledig bruikbaar.'?></div><p><small>Bewaartermijn: maximaal 90 kalenderdagen. Tijdzone: Europe/Amsterdam. Clientmeldingen kunnen ontbreken of door bots worden beïnvloed; gebruik ze niet als sluitende conversie- of omzetregistratie.</small></p>
<?php if ($stats!==null):?><div class="metrics admin-metrics"><?php foreach (['visit'=>'Paginabezoeken','start'=>'Dossiers gestart','review'=>'Overzichten bekeken','download'=>'Tabs met download'] as $key=>$label):?><article class="metric"><div class="metric-label"><?=sr_escape($label)?></div><div class="metric-value"><?=(int)$stats['totals'][$key]?></div><small>Gemeten gebeurtenissen</small></article><?php endforeach;?></div><h2>Downloads</h2><p>PDF: <strong><?=(int)$stats['totals']['pdf']?></strong> · ZIP: <strong><?=(int)$stats['totals']['zip']?></strong>. Een tab kan meerdere bestanden maken.</p><h2>Activiteit per dag</h2><div class="table-scroll"><table class="simple-table"><thead><tr><th>Datum</th><th>Bezoeken</th><th>Starts</th><th>Overzichten</th><th>PDF</th><th>ZIP</th></tr></thead><tbody><?php if (!$stats['days']):?><tr><td colspan="6">Nog geen gemeten activiteit.</td></tr><?php endif;foreach(array_reverse($stats['days']) as $row):?><tr><td><?=sr_escape($row['date'])?></td><?php foreach(['visit','start','review','pdf','zip'] as $key):?><td><?=(int)$row[$key]?></td><?php endforeach;?></tr><?php endforeach;?></tbody></table></div><h2>Weergaven per stap</h2><p>Situatie: <?=(int)$stats['totals']['step0']?> · Gegevens: <?=(int)$stats['totals']['step1']?> · Documenten: <?=(int)$stats['totals']['step2']?> · Overzicht: <?=(int)$stats['totals']['step3']?>. Geen sluitende funnel: toestemming kan tussentijds veranderen.</p><p><a class="btn btn-secondary" href="?export=1">Statistieken downloaden</a></p><?php endif;?>
<h2>Productstatus</h2><p>Versie <?=sr_escape(SR_VERSION)?> · Bronnen gecontroleerd op 14 november 2026. Nieuwe regels worden niet automatisch gepubliceerd.</p><p>Beheer: <?=sr_escape($c['operator'])?> · <?=sr_escape($c['contact'])?></p><form method="post"><input type="hidden" name="csrf" value="<?=sr_escape($_SESSION['csrf'])?>"><input type="hidden" name="action" value="logout"><button class="btn btn-secondary" type="submit">Veilig uitloggen</button></form><?php endif;?></main></body></html>
