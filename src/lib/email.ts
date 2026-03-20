/**
 * Email Service — DakkapellenKosten.nl
 * All transactional emails via Resend
 */

import { Resend } from "resend";

let _resend: Resend | null = null;
let _warnedMissing = false;

function getResend(): Resend | null {
    if (!process.env.RESEND_API_KEY) {
        if (!_warnedMissing) {
            console.error("[email] ⚠️  RESEND_API_KEY not set — emails will be skipped.");
            _warnedMissing = true;
        }
        return null;
    }
    if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
    return _resend;
}

const PLATFORM_FROM = process.env.EMAIL_FROM || "DakkapellenKosten.nl <noreply@dakkapellenkosten.nl>";
const REPLY_TO = process.env.EMAIL_REPLY_TO || "info@dakkapellenkosten.nl";

// ============================================
// Homeowner: Lead Confirmation
// ============================================

export async function sendLeadConfirmation({
    to,
    naam,
    dakkapelType,
    breedte,
    postcode,
}: {
    to: string;
    naam: string;
    dakkapelType: string;
    breedte: string;
    postcode: string;
}) {
    const firstName = naam.split(" ")[0];
    const html = `
<!DOCTYPE html>
<html lang="nl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <h2 style="color:#1B5E3B;margin:0;font-size:22px;">DakkapellenKosten.nl</h2>
    </div>
    <div style="background:white;border-radius:16px;border:1px solid #e2e8f0;padding:32px;margin-bottom:24px;">
      <div style="background:#f0fdf4;border-radius:12px;padding:16px;margin-bottom:20px;text-align:center;border:1px solid #bbf7d0;">
        <p style="color:#16a34a;font-size:18px;font-weight:700;margin:0;">✓ Je aanvraag is ontvangen!</p>
      </div>
      <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 16px;">
        Hoi ${firstName},
      </p>
      <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 24px;">
        Bedankt voor je aanvraag bij DakkapellenKosten.nl! We koppelen je aan maximaal 3 gespecialiseerde dakkapelbedrijven bij jou in de buurt.
      </p>
      <div style="background:#f8fafc;border-radius:12px;padding:20px;margin-bottom:24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="color:#64748b;font-size:13px;padding:4px 0;">Type dakkapel</td>
            <td style="color:#0f172a;font-size:13px;text-align:right;padding:4px 0;font-weight:600;">${dakkapelType}</td>
          </tr>
          <tr>
            <td style="color:#64748b;font-size:13px;padding:4px 0;">Breedte</td>
            <td style="color:#0f172a;font-size:13px;text-align:right;padding:4px 0;">${breedte}</td>
          </tr>
          <tr>
            <td style="color:#64748b;font-size:13px;padding:4px 0;">Postcode</td>
            <td style="color:#0f172a;font-size:13px;text-align:right;padding:4px 0;">${postcode}</td>
          </tr>
        </table>
      </div>
      <p style="color:#475569;font-size:14px;line-height:1.6;margin:0;">
        Je ontvangt binnen 48 uur reactie van onze geselecteerde specialisten. Ze nemen direct contact met je op.
      </p>
    </div>
    <div style="text-align:center;color:#94a3b8;font-size:12px;">
      <p>Via DakkapellenKosten.nl — Onafhankelijk vergelijkingsplatform</p>
    </div>
  </div>
</body>
</html>`;

    const r = getResend();
    if (!r) return null;

    return r.emails.send({
        from: PLATFORM_FROM,
        to,
        replyTo: REPLY_TO,
        subject: "Je dakkapel aanvraag is ontvangen ✓",
        html,
    });
}

// ============================================
// Company: New Lead Available
// ============================================

export async function sendNewLeadNotification({
    to,
    companyName,
    dakkapelType,
    breedte,
    postcode,
    distanceKm,
    dashboardUrl,
}: {
    to: string;
    companyName: string;
    dakkapelType: string;
    breedte: string;
    postcode: string;
    distanceKm: number;
    dashboardUrl: string;
}) {
    const html = `
<!DOCTYPE html>
<html lang="nl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <h2 style="color:#1B5E3B;margin:0;font-size:22px;">DakkapellenKosten.nl</h2>
    </div>
    <div style="background:white;border-radius:16px;border:1px solid #e2e8f0;padding:32px;margin-bottom:24px;">
      <div style="background:#eff6ff;border-radius:12px;padding:16px;margin-bottom:20px;text-align:center;">
        <p style="color:#1B5E3B;font-size:18px;font-weight:700;margin:0;">🏠 Nieuwe lead beschikbaar!</p>
        <p style="color:#64748b;font-size:13px;margin:4px 0 0;">Er is een klant in jouw regio</p>
      </div>
      <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 16px;">
        Hoi ${companyName},
      </p>
      <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 24px;">
        Er is een nieuwe dakkapel aanvraag die past bij jouw profiel. Accepteer de lead om de contactgegevens te ontvangen.
      </p>
      <div style="background:#f8fafc;border-radius:12px;padding:20px;margin-bottom:24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="color:#64748b;font-size:13px;padding:4px 0;">Type</td>
            <td style="color:#0f172a;font-size:13px;text-align:right;padding:4px 0;font-weight:600;">${dakkapelType}</td>
          </tr>
          <tr>
            <td style="color:#64748b;font-size:13px;padding:4px 0;">Breedte</td>
            <td style="color:#0f172a;font-size:13px;text-align:right;padding:4px 0;">${breedte}</td>
          </tr>
          <tr>
            <td style="color:#64748b;font-size:13px;padding:4px 0;">Regio</td>
            <td style="color:#0f172a;font-size:13px;text-align:right;padding:4px 0;">${postcode}</td>
          </tr>
          <tr>
            <td style="color:#64748b;font-size:13px;padding:4px 0;">Afstand</td>
            <td style="color:#0f172a;font-size:13px;text-align:right;padding:4px 0;">${distanceKm} km</td>
          </tr>
        </table>
      </div>
      <div style="text-align:center;">
        <a href="${dashboardUrl}" style="display:inline-block;background:#1B5E3B;color:white;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:600;font-size:15px;">
          Bekijk lead in dashboard
        </a>
      </div>
      <p style="color:#94a3b8;font-size:12px;text-align:center;margin:16px 0 0;">
        Reageer snel — maximaal 3 bedrijven per lead.
      </p>
    </div>
    <div style="text-align:center;color:#94a3b8;font-size:12px;">
      <p>Via DakkapellenKosten.nl</p>
    </div>
  </div>
</body>
</html>`;

    const r = getResend();
    if (!r) return null;

    return r.emails.send({
        from: PLATFORM_FROM,
        to,
        replyTo: REPLY_TO,
        subject: `Nieuwe dakkapel lead: ${dakkapelType} in regio ${postcode}`,
        html,
    });
}

// ============================================
// Company: Lead Accepted (contact details revealed)
// ============================================

export async function sendLeadAcceptedDetails({
    to,
    companyName,
    customerName,
    customerEmail,
    customerPhone,
    customerPostcode,
    dakkapelType,
    breedte,
    extraNotes,
}: {
    to: string;
    companyName: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerPostcode: string;
    dakkapelType: string;
    breedte: string;
    extraNotes?: string | null;
}) {
    const html = `
<!DOCTYPE html>
<html lang="nl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <h2 style="color:#1B5E3B;margin:0;font-size:22px;">DakkapellenKosten.nl</h2>
    </div>
    <div style="background:white;border-radius:16px;border:1px solid #e2e8f0;padding:32px;margin-bottom:24px;">
      <div style="background:#f0fdf4;border-radius:12px;padding:16px;margin-bottom:20px;text-align:center;border:1px solid #bbf7d0;">
        <p style="color:#16a34a;font-size:18px;font-weight:700;margin:0;">✅ Lead geaccepteerd!</p>
      </div>
      <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 16px;">
        Hoi ${companyName},
      </p>
      <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 24px;">
        Je hebt een lead geaccepteerd. Hieronder de contactgegevens van de klant:
      </p>
      <div style="background:#f8fafc;border-radius:12px;padding:20px;margin-bottom:20px;">
        <h3 style="margin:0 0 12px 0;font-size:14px;color:#0f172a;">Contactgegevens</h3>
        <p style="margin:4px 0;font-size:14px;color:#475569;">👤 <strong>${customerName}</strong></p>
        <p style="margin:4px 0;font-size:14px;color:#475569;">📧 <a href="mailto:${customerEmail}" style="color:#1B5E3B;">${customerEmail}</a></p>
        <p style="margin:4px 0;font-size:14px;color:#475569;">📞 <a href="tel:${customerPhone}" style="color:#1B5E3B;">${customerPhone}</a></p>
        <p style="margin:4px 0;font-size:14px;color:#475569;">📍 ${customerPostcode}</p>
      </div>
      <div style="background:#f8fafc;border-radius:12px;padding:20px;margin-bottom:20px;">
        <h3 style="margin:0 0 12px 0;font-size:14px;color:#0f172a;">Projectdetails</h3>
        <p style="margin:4px 0;font-size:14px;color:#475569;">Type: <strong>${dakkapelType}</strong></p>
        <p style="margin:4px 0;font-size:14px;color:#475569;">Breedte: <strong>${breedte}</strong></p>
        ${extraNotes ? `<p style="margin:8px 0 4px;font-size:14px;color:#475569;">Opmerkingen: ${extraNotes}</p>` : ""}
      </div>
      <p style="color:#475569;font-size:15px;line-height:1.6;margin:0;">
        Neem zo snel mogelijk contact op met de klant. Snelheid is de sleutel tot succes!
      </p>
    </div>
    <div style="text-align:center;color:#94a3b8;font-size:12px;">
      <p>Via DakkapellenKosten.nl</p>
    </div>
  </div>
</body>
</html>`;

    const r = getResend();
    if (!r) return null;

    return r.emails.send({
        from: PLATFORM_FROM,
        to,
        replyTo: REPLY_TO,
        subject: `Lead geaccepteerd: ${customerName} — ${dakkapelType} dakkapel`,
        html,
    });
}

// ============================================
// Auth: Email Verification
// ============================================

export async function sendVerificationEmail({
    to,
    name,
    verifyUrl,
}: {
    to: string;
    name: string;
    verifyUrl: string;
}) {
    const html = `
<!DOCTYPE html>
<html lang="nl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:550px;margin:40px auto;padding:0 16px;">
    <div style="background:white;border-radius:16px;padding:40px 32px;border:1px solid #e2e8f0;">
      <h1 style="font-size:20px;color:#0f172a;margin:0 0 16px 0;">Verifieer je e-mailadres</h1>
      <p style="color:#475569;font-size:15px;line-height:1.6;">
        Hoi ${name.split(" ")[0]},
      </p>
      <p style="color:#475569;font-size:15px;line-height:1.6;">
        Welkom bij DakkapellenKosten.nl! Klik op de knop hieronder om je e-mailadres te verifiëren.
      </p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${verifyUrl}" style="display:inline-block;background:#1B5E3B;color:white;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:600;font-size:15px;">
          E-mail verifiëren
        </a>
      </div>
      <p style="color:#94a3b8;font-size:13px;line-height:1.6;">
        Heb je geen account aangemaakt? Dan kun je deze e-mail negeren.
      </p>
    </div>
    <div style="text-align:center;color:#94a3b8;font-size:12px;margin-top:24px;">
      <p>Via DakkapellenKosten.nl</p>
    </div>
  </div>
</body>
</html>`;

    const r = getResend();
    if (!r) return null;

    return r.emails.send({
        from: PLATFORM_FROM,
        to,
        replyTo: REPLY_TO,
        subject: "Verifieer je e-mailadres — DakkapellenKosten.nl",
        html,
    });
}

// ============================================
// Auth: Password Reset
// ============================================

export async function sendPasswordResetEmail({
    to,
    name,
    resetUrl,
}: {
    to: string;
    name: string;
    resetUrl: string;
}) {
    const html = `
<!DOCTYPE html>
<html lang="nl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:550px;margin:40px auto;padding:0 16px;">
    <div style="background:white;border-radius:16px;padding:40px 32px;border:1px solid #e2e8f0;">
      <h1 style="font-size:20px;color:#0f172a;margin:0 0 16px 0;">Wachtwoord resetten</h1>
      <p style="color:#475569;font-size:15px;line-height:1.6;">
        Hoi ${name.split(" ")[0]},
      </p>
      <p style="color:#475569;font-size:15px;line-height:1.6;">
        Klik op de knop hieronder om een nieuw wachtwoord in te stellen. Deze link is 1 uur geldig.
      </p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${resetUrl}" style="display:inline-block;background:#1B5E3B;color:white;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:600;font-size:15px;">
          Wachtwoord resetten
        </a>
      </div>
      <p style="color:#94a3b8;font-size:13px;line-height:1.6;">
        Geen wachtwoordreset aangevraagd? Negeer deze e-mail.
      </p>
    </div>
    <div style="text-align:center;color:#94a3b8;font-size:12px;margin-top:24px;">
      <p>Via DakkapellenKosten.nl</p>
    </div>
  </div>
</body>
</html>`;

    const r = getResend();
    if (!r) return null;

    return r.emails.send({
        from: PLATFORM_FROM,
        to,
        replyTo: REPLY_TO,
        subject: "Wachtwoord resetten — DakkapellenKosten.nl",
        html,
    });
}

// ============================================
// Credit Purchase Confirmation
// ============================================

export async function sendCreditPurchaseConfirmation({
    to,
    companyName,
    credits,
    amountEur,
}: {
    to: string;
    companyName: string;
    credits: number;
    amountEur: string;
}) {
    const html = `
<!DOCTYPE html>
<html lang="nl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:550px;margin:40px auto;padding:0 16px;">
    <div style="background:white;border-radius:16px;padding:40px 32px;border:1px solid #e2e8f0;">
      <div style="text-align:center;margin-bottom:24px;">
        <div style="display:inline-block;background:#f0fdf4;border-radius:16px;padding:16px;">
          <span style="font-size:32px;">💳</span>
        </div>
      </div>
      <h1 style="font-size:20px;color:#0f172a;margin:0 0 16px 0;text-align:center;">Credits toegevoegd!</h1>
      <p style="color:#475569;font-size:15px;line-height:1.6;">
        Hoi ${companyName},
      </p>
      <p style="color:#475569;font-size:15px;line-height:1.6;">
        Je creditaankoop is verwerkt. <strong>${credits} credits</strong> zijn toegevoegd aan je account.
      </p>
      <div style="background:#f8fafc;border-radius:12px;padding:20px;margin:20px 0;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="color:#64748b;font-size:13px;padding:4px 0;">Credits</td>
            <td style="color:#0f172a;font-size:13px;text-align:right;padding:4px 0;font-weight:600;">${credits}</td>
          </tr>
          <tr>
            <td style="color:#64748b;font-size:13px;padding:4px 0;">Bedrag</td>
            <td style="color:#0f172a;font-size:13px;text-align:right;padding:4px 0;font-weight:600;">${amountEur}</td>
          </tr>
        </table>
      </div>
    </div>
    <div style="text-align:center;color:#94a3b8;font-size:12px;margin-top:24px;">
      <p>Via DakkapellenKosten.nl</p>
    </div>
  </div>
</body>
</html>`;

    const r = getResend();
    if (!r) return null;

    return r.emails.send({
        from: PLATFORM_FROM,
        to,
        replyTo: REPLY_TO,
        subject: `${credits} credits toegevoegd aan je account`,
        html,
    });
}
