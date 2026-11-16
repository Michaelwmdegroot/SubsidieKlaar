<?php
declare(strict_types=1);
if (PHP_SAPI!=='cli') {http_response_code(404);exit;}
require dirname(__DIR__,2).'/server/next/service.php';
require_once dirname(__DIR__,2).'/server/next/mail-template.php';
try {
    $c=srn_config();
    $local=in_array('--local-inbox',$argv,true);
    $send=in_array('--send',$argv,true);
    if (!$local&&!$send)throw new RuntimeException('Gebruik --local-inbox of --send.');
    if ($local&&$c['mode']!=='local')throw new RuntimeException('Testpostbus alleen lokaal.');
    if ($send&&(!in_array($c['transport'],['mail','smtp'],true)||
        ($c['mail_ready']??false)!==true||!srn_email($c['mail_from']??null))) {
        throw new RuntimeException('Mailaflevering niet geconfigureerd.');
    }

    $result=srn_tx($c,function(&$s)use($c,$local) {
        $out=[];
        foreach($s['outbox'] as $id=>$v) {
            if (($v['state']??'')!=='queued')continue;
            if ($v['expires']<time()||$v['attempts']>=3) {
                $s['outbox'][$id]['state']='expired';
                $s['outbox'][$id]['text']='';
                continue;
            }
            if ($v['type']==='reminder'&&!isset($s['reminders'][$v['meta']['reminder']??''])) {
                $s['outbox'][$id]['state']='cancelled';
                $s['outbox'][$id]['text']='';
                continue;
            }
            $s['outbox'][$id]['attempts']++;
            if ($local) {
                $out[]=['to'=>$v['to'],'type'=>$v['type'],'text'=>$v['text']];
                $s['outbox'][$id]['state']='test-read';
                $s['outbox'][$id]['text']='';
            } else {
                $subject=$v['type']==='otp'
                    ?'SubsidieReady verificatiecode'
                    :($v['type']==='portal'?'SubsidieReady | Nieuwe adviesaanvraag':'SubsidieReady: je gekozen herinnering');
                try {
                    $ok=$c['transport']==='smtp'
                        ?srn_smtp_send($c,$v['to'],$subject,$v['text'],$v['type']==='otp'?srn_otp_email_html($v['text']):null)
                        :mail($v['to'],$subject,$v['text'],[
                            'From'=>$c['mail_from'],
                            'Content-Type'=>'text/plain; charset=UTF-8',
                            'X-Mailer'=>'SubsidieReady'
                        ]);
                }catch(Throwable){$ok=false;}
                $s['outbox'][$id]['state']=$ok?'sent':'queued';
                if ($ok)$s['outbox'][$id]['text']='';
                $out[]=['id'=>$id,'accepted_by_mail_system'=>$ok];
            }
            if (count($out)>=20)break;
        }
        return $out;
    });
    echo json_encode($result,JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE)."\n";
} catch(Throwable){
    fwrite(STDERR,"Mailworker niet uitgevoerd; controleer private configuratie en accountactivatie.\n");
    exit(1);
}
