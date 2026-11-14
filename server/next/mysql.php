<?php
declare(strict_types=1);

/**
 * Experimental MySQL state adapter for the existing next-level API.
 * It deliberately reuses the audited OTP, ownership, revision and deletion logic.
 * Staging/loopback ONLY; live subsidieready.nl is still rejected by srn_config().
 *
 * The first milestone stores one encrypted state snapshot in one locked InnoDB row.
 * It is NOT a normalized CRM/analytics database and retains pilot limits.
 */
function srn_mysql_validate(array $c): void {
    if (($c['storage_driver'] ?? null) !== 'mysql') {
        throw new RuntimeException('Ongeldige databaseconfiguratie.');
    }
    if (!extension_loaded('pdo_mysql')) {
        throw new RuntimeException('PDO MySQL is niet beschikbaar.');
    }
    // No cross-entity lead data, staff access or vault files in the initial SQL pilot.
    foreach (['vault_enabled', 'leads_enabled', 'staff_enabled'] as $feature) {
        if (($c[$feature] ?? false) !== false) {
            throw new RuntimeException('MySQL pilot: alleen accounts en online plannen.');
        }
    }
    $db = $c['mysql'] ?? null;
    if (!is_array($db) || array_is_list($db)) {
        throw new RuntimeException('Private MySQL-instellingen ontbreken.');
    }
    $keys = ['host', 'port', 'database', 'user', 'password'];
    if (array_diff(array_keys($db), $keys) || array_diff($keys, array_keys($db))) {
        throw new RuntimeException('Ongeldige MySQL-instellingen.');
    }
    // First release supports only a local database connection to avoid sending
    // credentials to an unverified remote service without a confirmed TLS setup.
    if (!in_array($db['host'], ['localhost', '127.0.0.1'], true)
        || !is_int($db['port']) || $db['port'] < 1 || $db['port'] > 65535
        || !is_string($db['database']) || !preg_match('/^[A-Za-z0-9_]{1,64}$/D', $db['database'])
        || !is_string($db['user']) || !preg_match('/^[A-Za-z0-9_]{1,64}$/D', $db['user'])
        || !is_string($db['password']) || $db['password'] === '') {
        throw new RuntimeException('Ongeldige MySQL-verbindingsinstellingen.');
    }
}

function srn_mysql_connect(array $c): PDO {
    srn_mysql_validate($c);
    $db = $c['mysql'];
    $dsn = 'mysql:host='.$db['host'].';port='.$db['port'].';dbname='.$db['database'].';charset=utf8mb4';
    $pdo = new PDO($dsn, $db['user'], $db['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::ATTR_TIMEOUT => 5,
        PDO::ATTR_PERSISTENT => false
    ]);
    $pdo->exec('SET SESSION innodb_lock_wait_timeout = 3');
    return $pdo;
}

function srn_mysql_state(array $c, PDO $pdo): array {
    $statement = $pdo->query('SELECT encrypted_state FROM sr_next_state WHERE id = 1 FOR UPDATE');
    $row = $statement->fetch();
    if (!is_array($row) || !is_string($row['encrypted_state'] ?? null)) {
        throw new RuntimeException('MySQL-schema ontbreekt of is niet ingericht.');
    }
    $raw = $row['encrypted_state'];
    if (strlen($raw) > 12 * 1024 * 1024) {
        throw new RuntimeException('MySQL-opslaglimiet overschreden.');
    }
    $s = $raw === '' ? srn_empty() : json_decode(srn_decrypt($raw, $c), true, 64, JSON_THROW_ON_ERROR);
    if (!is_array($s) || ($s['schema'] ?? 0) !== SRN_SCHEMA) {
        throw new RuntimeException('Onbekend opslagformaat.');
    }
    foreach (array_keys(srn_empty()) as $key) {
        if ($key !== 'schema' && !is_array($s[$key] ?? null)) {
            throw new RuntimeException('Onbekend opslagformaat.');
        }
    }
    $now = time();
    foreach (['sessions', 'challenges', 'limits'] as $key) {
        foreach ($s[$key] as $id => $value) {
            if (($value['expires'] ?? 0) < $now) {
                unset($s[$key][$id]);
            }
        }
    }
    $s['audit'] = array_slice($s['audit'], -2000);
    // This pilot must never import or operate on legacy files or sales records.
    // Those need their own storage migrations, access policy and restore proof.
    if ($s['files'] !== [] || $s['leads'] !== []) {
        throw new RuntimeException('MySQL pilot bevat niet-ondersteunde documenten of salesgegevens.');
    }
    return $s;
}

function srn_mysql_tx(array $c, callable $fn): mixed {
    $pdo = srn_mysql_connect($c);
    $pdo->beginTransaction();
    try {
        $state = srn_mysql_state($c, $pdo);
        $result = $fn($state);
        // Refuse unsupported file deletion BEFORE committing the SQL state.
        if (is_array($result) && isset($result['_purge']) && $result['_purge'] !== []) {
            throw new RuntimeException('MySQL pilot bevat onverwachte documentverwijderingen.');
        }
        $json = json_encode($state, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE);
        if (strlen($json) > 10 * 1024 * 1024) {
            throw new RuntimeException('Opslaglimiet bereikt.');
        }
        $ciphertext = srn_encrypt($json, $c);
        $write = $pdo->prepare('UPDATE sr_next_state SET encrypted_state = :ciphertext WHERE id = 1');
        $write->bindValue(':ciphertext', $ciphertext, PDO::PARAM_LOB);
        $write->execute();
        if ($write->rowCount() !== 1) {
            throw new RuntimeException('Opslagtransactie niet bevestigd.');
        }
        $pdo->commit();
        // Existing account deletion returns _purge=[], removed from the response.
        if (is_array($result)) unset($result['_purge']);
        return $result;
    } catch (Throwable $error) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $error;
    }
}
