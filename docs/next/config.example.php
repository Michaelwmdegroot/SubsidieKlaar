<?php
// DOCUMENTATION ONLY. Copy the structure to a private file OUTSIDE the source/webroot.
// Placeholders deliberately fail validation. No credentials exist in this file.
return [
 'mode' => 'staging',
 'origin' => 'https://EXACT-PROTECTED-TEST-HOST.invalid',
 'dir' => '/ABSOLUTE/PERSISTENT/PRIVATE/DIRECTORY',
 'key' => 'GENERATE_32_RANDOM_BYTES_AND_ENCODE_AS_64_LOWERCASE_HEX_LOCALLY',
 'controller' => 'CONFIRM_LEGAL_ENTITY_BEFORE_ACTIVATION',
 'contact' => 'privacy@example.invalid',
 'privacy_reviewed' => false,
 'transport' => 'mail',
 'mail_ready' => false,
 'mail_from' => 'service@example.invalid',
 'accounts_enabled' => false,
 'vault_enabled' => false,
 'local_test_files' => false,
 'scanner' => '/ABSOLUTE/VERIFIED/PATH/TO/clamscan',
 'leads_enabled' => false,
 'staff_enabled' => false,
 'staff' => [],
 'destinations' => [],
];
