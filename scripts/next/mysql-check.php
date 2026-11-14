<?php
declare(strict_types=1);

// Read-only MySQL readiness check. Never expose credentials, data or paths.
if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}
require dirname(__DIR__, 2).'/server/next/service.php';
if ($argc !== 2 || $argv[1] !== '--check') {
    fwrite(STDERR, "Gebruik: php scripts/next/mysql-check.php --check\n");
    exit(2);
}
try {
    $config = srn_config();
    if (($config['storage_driver'] ?? 'file') !== 'mysql') {
        throw new RuntimeException('MySQL-driver is niet ingeschakeld.');
    }
    $db = srn_mysql_connect($config);
    $db->beginTransaction();
    try {
        // Validates the migration, encryption key and state integrity.
        $state = srn_mysql_state($config, $db);
        $db->rollBack(); // Diagnostic never changes a record.
    } catch (Throwable $error) {
        if ($db->inTransaction()) $db->rollBack();
        throw $error;
    }
    echo json_encode([
        'status' => 'ready_for_synthetic_staging_tests',
        'mode' => $config['mode'],
        'database' => 'connected',
        'encrypted_schema' => 'readable',
        'accounts_flag' => ($config['accounts_enabled'] ?? false) === true,
        'vault_flag' => false,
        'leads_flag' => false,
        'production_enabled' => false,
    ], JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT)."\n";
} catch (Throwable $error) {
    // Fail closed without reproducing SQL errors, DB hostnames, secrets or data.
    fwrite(STDERR, "NO-GO: de MySQL-stagingcontrole is niet geslaagd. Controleer private configuratie, PDO-MySQL en schema.\n");
    exit(1);
}
