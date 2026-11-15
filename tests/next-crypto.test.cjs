'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
test('Hostinger-compatible AES-256-GCM encrypts, authenticates and reads legacy sodium',()=>{
 const service=JSON.stringify(path.join(__dirname,'../server/next/service.php'));
 const php="require SERVICE_MARKER;\n$c=['keyBytes'=>str_repeat('k',32)];\nif (!srn_openssl_ready()) throw new Exception('OpenSSL AES-256-GCM required');\n$raw=srn_encrypt('private-synthetic-account-data',$c);\nif(substr($raw,0,4)!=='SRN2' || srn_decrypt($raw,$c)!=='private-synthetic-account-data')throw new Exception('roundtrip');\nif(str_contains($raw,'private-synthetic-account-data'))throw new Exception('plaintext leak');\nif($raw===srn_encrypt('private-synthetic-account-data',$c))throw new Exception('nonce reused');\n$rejected=0;\nforeach([4,16,32] as $pos){\n $bad=$raw;$bad[$pos]=chr(ord($bad[$pos])^1);\n try{srn_decrypt($bad,$c);}catch(RuntimeException){$rejected++;}\n}\n$wrong=['keyBytes'=>str_repeat('z',32)];\ntry{srn_decrypt($raw,$wrong);}catch(RuntimeException){$rejected++;}\ntry{srn_decrypt(substr($raw,0,12),$c);}catch(RuntimeException){$rejected++;}\nif($rejected!==5)throw new Exception('tampered ciphertext accepted');\n$legacy='not-tested';\nif(extension_loaded('sodium')){\n $nonce=random_bytes(SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);\n $old='SRN1'.$nonce.sodium_crypto_secretbox('legacy-value',$nonce,$c['keyBytes']);\n if(srn_decrypt($old,$c)!=='legacy-value')throw new Exception('legacy read failed');\n $legacy='readable';\n}\necho json_encode(['format'=>'SRN2','tampering_rejected'=>$rejected,'legacy'=>$legacy]);".replace('SERVICE_MARKER',service);
 const data=JSON.parse(execFileSync('php',['-r',php],{encoding:'utf8'}));
 assert.equal(data.format,'SRN2');
 assert.equal(data.tampering_rejected,5);
 assert.ok(['readable','not-tested'].includes(data.legacy));
});
