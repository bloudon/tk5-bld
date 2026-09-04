import { Router, type IRouter } from "express";
import { z } from "zod";
import nodemailer from "nodemailer";

const router: IRouter = Router();

const escapeHtml = (value: string) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");

const ContactBody = z.object({
  name: z.string().min(1),
  company: z.string().optional(),
  email: z.string().email(),
  phone: z.string().min(1),
  service: z.string().min(1),
  market: z.string().min(1),
  message: z.string().min(1),
  attribution: z.object({
    landingPage: z.string().max(2048),
    referrer: z.string().max(2048).optional(),
    utmSource: z.string().max(200).optional(),
    utmMedium: z.string().max(200).optional(),
    utmCampaign: z.string().max(200).optional(),
    utmTerm: z.string().max(200).optional(),
    utmContent: z.string().max(200).optional(),
  }).optional(),
});

function getTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP2GO_HOST ?? "mail.smtp2go.com",
    port: Number(process.env.SMTP2GO_PORT ?? 587),
    secure: false,
    auth: {
      user: process.env.SMTP2GO_USERNAME,
      pass: process.env.SMTP2GO_PASSWORD,
    },
  });
}

const SERVICE_LABELS: Record<string, string> = {
  "permit-general": "Permit Expediting – Not Sure Which Type",
  "permit-residential": "Permit Expediting – Residential",
  "permit-commercial": "Permit Expediting – Commercial",
  inspection: "Inspection Scheduling",
  erecording: "E-Recording",
  "multi-site": "Multi-Site Permit Coordination",
  "notary-traditional": "Traditional Notary",
  "notary-ron": "Remote Online Notary (RON)",
  other: "Other / Not Sure",
};

router.post("/contact", async (req, res) => {
  const parsed = ContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid form data" });
    return;
  }

  const { name, company, email, phone, service, market, message, attribution } = parsed.data;
  const serviceLabel = SERVICE_LABELS[service] ?? service;
  const safe = {
    name: escapeHtml(name),
    company: company ? escapeHtml(company) : "",
    email: escapeHtml(email),
    phone: escapeHtml(phone),
    market: escapeHtml(market),
    message: escapeHtml(message),
    service: escapeHtml(serviceLabel),
    attribution: attribution ? escapeHtml(JSON.stringify(attribution)) : "",
  };
  const toEmail = process.env.CONTACT_TO_EMAIL ?? "info@bldpermit.com";
  const fromEmail = process.env.SMTP_FROM_EMAIL ?? "info@bldpermit.com";
  const fromName = process.env.SMTP_FROM_NAME ?? "Team K5 Construction & Development Coordination";
  const replyTo = process.env.SMTP_REPLY_TO ?? email;

  req.log.info({ service, market }, "Contact form submission received");

  try {
    const transport = getTransport();

    // Notification to Team K5
    await transport.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      replyTo: email,
      to: toEmail,
      subject: `New Inquiry: ${serviceLabel} — ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#0a1628;padding:24px 32px;">
            <h2 style="color:#fff;margin:0;font-size:20px;">New Contact Form Submission</h2>
          </div>
          <div style="padding:32px;border:1px solid #e4e4e7;border-top:none;">
            <table style="width:100%;border-collapse:collapse;">
               <tr><td style="padding:8px 0;color:#71717a;width:140px;font-size:14px;">Name</td><td style="padding:8px 0;font-size:14px;font-weight:600;">${safe.name}</td></tr>
               ${company ? `<tr><td style="padding:8px 0;color:#71717a;font-size:14px;">Company</td><td style="padding:8px 0;font-size:14px;">${safe.company}</td></tr>` : ""}
               <tr><td style="padding:8px 0;color:#71717a;font-size:14px;">Email</td><td style="padding:8px 0;font-size:14px;">${safe.email}</td></tr>
               <tr><td style="padding:8px 0;color:#71717a;font-size:14px;">Phone</td><td style="padding:8px 0;font-size:14px;">${safe.phone}</td></tr>
               <tr><td style="padding:8px 0;color:#71717a;font-size:14px;">Service</td><td style="padding:8px 0;font-size:14px;">${safe.service}</td></tr>
               <tr><td style="padding:8px 0;color:#71717a;font-size:14px;">Market</td><td style="padding:8px 0;font-size:14px;">${safe.market}</td></tr>
               ${attribution ? `<tr><td style="padding:8px 0;color:#71717a;font-size:14px;">Attribution</td><td style="padding:8px 0;font-size:14px;">${safe.attribution}</td></tr>` : ""}
            </table>
            <hr style="border:none;border-top:1px solid #e4e4e7;margin:16px 0;" />
            <p style="color:#71717a;font-size:13px;margin:0 0 8px;">Message</p>
             <p style="font-size:14px;line-height:1.6;white-space:pre-wrap;margin:0;">${safe.message}</p>
          </div>
        </div>
      `,
    });

    // Auto-reply to the sender
    await transport.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      replyTo,
      to: email,
      subject: "We received your message — Team K5",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#0a1628;padding:24px 32px;">
             <h2 style="color:#fff;margin:0;font-size:20px;">Thank you, ${safe.name}.</h2>
          </div>
          <div style="padding:32px;border:1px solid #e4e4e7;border-top:none;">
            <p style="font-size:15px;line-height:1.7;color:#3f3f46;">We've received your inquiry about <strong>${safe.service}</strong> for <strong>${safe.market}</strong>. Team K5 Construction &amp; Development Coordination will be in touch within 1 business day.</p>
            <p style="font-size:15px;line-height:1.7;color:#3f3f46;">If you need to reach us sooner:</p>
            <ul style="font-size:14px;color:#3f3f46;line-height:1.8;">
              <li>Primary phone: <a href="tel:+14074695599" style="color:#1d4ed8;">407-469-5599</a></li>
            </ul>
            <p style="font-size:13px;color:#a1a1aa;margin-top:32px;">Team K5 Construction and Development Coordination, LLC<br/>Serving Florida &amp; Nationwide</p>
          </div>
        </div>
      `,
    });

    req.log.info({ service, market }, "Contact emails sent successfully");
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to send contact email");
    res.status(500).json({ error: "Failed to send message. Please call us directly." });
  }
});

export default router;
