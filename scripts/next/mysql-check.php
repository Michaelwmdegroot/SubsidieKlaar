<?php
declare(strict_types=1);

// Read-only MySQL readiness check. Never expose credentials, personal data or filesystem paths.
if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}
require dirname(__DIR__, 2).'/server/next/service.php';
if ($argc !== 2 || !in_array($argv[1], ['--check', '--db-only'], true)) {
    fwrite(STDERR, "Gebruik: php scripts/next/mysql-check.php --db-only | --check\n");
    exit(2);
}
try {
    $dbOnly = $argv[1] === '--db-only';
    if ($dbOnly) {
        // This database check works BEFORE account/legal/mail activation.
        // Reuse the same private config location and path constraints as the API.
        $root = realpath(dirname(__DIR__, 2));
        if (!$root) throw new RuntimeException('Repositorypad onbekend.');
        $configPath = getenv('SR_NEXT_CONFIG');
        if (!$configPath) $configPath = dirname($root).'/subsidieready-private/next-config.php';
        if (!is_string($configPath) || !is_file($configPath) || is_link($configPath)) {
            throw new RuntimeException('Private configuratie ontbreekt.');
        }
        $real = realpath($configPath);
        if (!$real || str_starts_with($real, $root.DIRECTORY_SEPARATOR)) {
            throw new RuntimeException('Private configuratie mag niet in de webroot staan.');
        }
        if (function_exists('opcache_invalidate')) @opcache_invalidate($real, true);
        $config = require $real;
        if (!is_array($config) || !in_array($config['mode'] ?? '', ['local', 'staging', 'production'], true)) {
            throw new RuntimeException('Ongeldige configuratie.');
        }
        $privateDir = realpath($config['dir'] ?? '');
        if (!$privateDir || !is_dir($privateDir) || is_link($config['dir']) ||
            $privateDir === $root || str_starts_with($privateDir, $root.DIRECTORY_SEPARATOR)) {
            throw new RuntimeException('Private opslag is ongeldig.');
        }
        if (!extension_loaded('sodium') || !is_string($config['key'] ?? null) ||
            !preg_match('/^[a-f0-9]{64}$/D', $config['key'])) {
            throw new RuntimeException('Versleutelingssleutel ontbreekt of is ongeldig.');
        }
        $config['keyBytes'] = hex2bin($config['key']);
    } else {
        // Full acceptance enforces every existing legal, mail and account gate.
        $config = srn_config();
    }
    if (($config['storage_driver'] ?? 'file') !== 'mysql') {
        throw new RuntimeException('MySQL-driver is niet ingeschakeld.');
    }
    $db = srn_mysql_connect($config);
    $db->beginTransaction();
    try {
        // Validate the InnoDB schema and key without altering a record.
        srn_mysql_state($config, $db);
        $db->rollBack();
    } catch (Throwable $error) {
        if ($db->inTransaction()) $db->rollBack();
        throw $error;
    }
    echo json_encode([
        'status' => 'database_ready',
        'mode' => $config['mode'],
        'database' => 'connected',
        'encrypted_schema' => 'readable',
        'accounts_flag' => ($config['accounts_enabled'] ?? false) === true,
        'vault_flag' => false,
        'leads_flag' => false,
        'production_enabled' => !$dbOnly && $config['mode'] === 'production' && ($config['accounts_enabled'] ?? false) === true,
        'activation_checks' => $dbOnly ? 'not_performed' : 'performed',
    ], JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT)."\n";
} catch (Throwable $error) {
    // Never print exception strings; they may contain secrets or private paths.
    fwrite(STDERR, "NO-GO: databasecontrole niet geslaagd. Controleer private configuratie, sleutel, PDO-MySQL en schema.\n");
    exit(1);
}
