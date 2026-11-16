<?php
declare(strict_types=1);

/**
 * Transactional HTML alternative for a single OTP message.
 * Intentionally self-contained: no images, trackers, remote fonts, scripts or links.
 * The plaintext original is always sent as the first MIME alternative.
 */
function srn_otp_email_html(string $plain): string {
    if (!preg_match('/^Je SubsidieReady-code is: ([0-9]{8})$/mD', str_replace("\r", '', $plain), $match)) {
        throw new InvalidArgumentException('Ongeldig verificatiebericht.');
    }
    $code = $match[1];

    return '<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'.
    '<title>SubsidieReady verificatiecode</title></head>'.
    '<body style="margin:0;padding:0;background:#f1f5f2;color:#15263d;font-family:Arial,Helvetica,sans-serif;">'.
    '<div style="display:none;font-size:1px;max-height:0;opacity:0;overflow:hidden;">Eenmalige aanmeldcode voor SubsidieReady, geldig voor 10 minuten.</div>'.
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f1f5f2;padding:32px 12px;">'.
    '<tr><td align="center"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;">'.
    '<tr><td style="padding:0 6px 20px;"><span style="display:inline-block;background:#08772e;color:#fff;border-radius:10px;padding:7px 11px;font-size:19px;font-weight:bold;vertical-align:middle;">&#10003;</span>'.
    '<span style="display:inline-block;margin-left:10px;vertical-align:middle;font-size:23px;font-weight:800;color:#13253d;letter-spacing:-0.6px;">Subsidie<span style="color:#08772e;">Ready</span></span></td></tr>'.
    '<tr><td style="background:#fff;border:1px solid #dbe6dc;border-radius:22px;padding:38px 38px 33px;">'.
    '<p style="margin:0 0 18px;font-size:11px;line-height:1.4;letter-spacing:1.5px;font-weight:800;color:#137836;">BEVEILIGDE AANMELDING</p>'.
    '<h1 style="font-size:28px;line-height:1.2;margin:0 0 14px;letter-spacing:-0.7px;color:#14263c;">Jouw verificatiecode</h1>'.
    '<p style="font-size:15px;line-height:1.75;margin:0 0 23px;color:#4f6172;">Je wilt inloggen bij SubsidieReady. Vul onderstaande eenmalige code in op de website die je al open hebt.</p>'.
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 22px;border:1px solid #d1e8d3;border-radius:15px;background:#edf8ed;">'.
    '<tr><td align="center" style="padding:25px 8px 10px;color:#0f6b2c;font-size:11px;letter-spacing:1.5px;font-weight:bold;">JOUW EENMALIGE CODE</td></tr>'.
    '<tr><td align="center" style="padding:0 8px 25px;font-size:35px;letter-spacing:5px;font-weight:800;line-height:1.35;color:#14263c;white-space:nowrap;">'.$code.'</td></tr></table>'.
    '<p style="font-size:14px;line-height:1.6;margin:0 0 22px;color:#2f4c3e;"><strong>&#9719; 10 minuten geldig.</strong> Na gebruik vervalt deze code automatisch.</p>'.
    '<div style="border-top:1px solid #e4ebe5;padding-top:20px;">'.
    '<p style="font-size:13px;line-height:1.65;margin:0;color:#60717b;">Heb je zelf geen code aangevraagd? Je kunt dit bericht negeren. Deel je code nooit met iemand, ook niet met een medewerker van SubsidieReady.</p>'.
    '</div></td></tr>'.
    '<tr><td style="padding:24px 15px 0;text-align:center;color:#6b7c76;font-size:11px;line-height:1.8;">'.
    'Verzonden door SubsidieReady namens NIVO Groep Holland B.V.<br>'.
    'Dit is een beveiligingsbericht, geen commerciële e-mail.<br>subsidieready.nl'.
    '</td></tr></table></td></tr></table></body></html>';
}
