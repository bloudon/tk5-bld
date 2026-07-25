import { Router, type IRouter } from "express";
import { z } from "zod";
import nodemailer from "nodemailer";

const router: IRouter = Router();

const ContactBody = z.object({
  name: z.string().min(1),
  company: z.string().optional(),
  email: z.string().email(),
  phone: z.string().min(1),
  service: z.string().min(1),
  message: z.string().min(1),
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
  "permit-residential": "Permit Expediting – Residential",
  "permit-commercial": "Permit Expediting – Commercial",
  inspection: "Inspection Scheduling",
  erecording: "E-Recording",
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

  const { name, company, email, phone, service, message } = parsed.data;
  const serviceLabel = SERVICE_LABELS[service] ?? service;
  const toEmail = process.env.CONTACT_TO_EMAIL ?? "info@bldpermit.com";
  const fromEmail = process.env.SMTP_FROM_EMAIL ?? "info@bldpermit.com";
  const fromName = process.env.SMTP_FROM_NAME ?? "Team K5 Permitting Services";
  const replyTo = process.env.SMTP_REPLY_TO ?? email;

  req.log.info({ name, email, service }, "Contact form submission received");

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
              <tr><td style="padding:8px 0;color:#71717a;width:140px;font-size:14px;">Name</td><td style="padding:8px 0;font-size:14px;font-weight:600;">${name}</td></tr>
              ${company ? `<tr><td style="padding:8px 0;color:#71717a;font-size:14px;">Company</td><td style="padding:8px 0;font-size:14px;">${company}</td></tr>` : ""}
              <tr><td style="padding:8px 0;color:#71717a;font-size:14px;">Email</td><td style="padding:8px 0;font-size:14px;"><a href="mailto:${email}" style="color:#1d4ed8;">${email}</a></td></tr>
              <tr><td style="padding:8px 0;color:#71717a;font-size:14px;">Phone</td><td style="padding:8px 0;font-size:14px;"><a href="tel:${phone}" style="color:#1d4ed8;">${phone}</a></td></tr>
              <tr><td style="padding:8px 0;color:#71717a;font-size:14px;">Service</td><td style="padding:8px 0;font-size:14px;">${serviceLabel}</td></tr>
            </table>
            <hr style="border:none;border-top:1px solid #e4e4e7;margin:16px 0;" />
            <p style="color:#71717a;font-size:13px;margin:0 0 8px;">Message</p>
            <p style="font-size:14px;line-height:1.6;white-space:pre-wrap;margin:0;">${message}</p>
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
            <h2 style="color:#fff;margin:0;font-size:20px;">Thank you, ${name}.</h2>
          </div>
          <div style="padding:32px;border:1px solid #e4e4e7;border-top:none;">
            <p style="font-size:15px;line-height:1.7;color:#3f3f46;">We've received your inquiry about <strong>${serviceLabel}</strong> and a member of Team K5 will be in touch within 1 business day.</p>
            <p style="font-size:15px;line-height:1.7;color:#3f3f46;">If you need to reach us sooner:</p>
            <ul style="font-size:14px;color:#3f3f46;line-height:1.8;">
              <li>Call: <a href="tel:4074695599" style="color:#1d4ed8;">(407) 469-5599</a> — Clermont</li>
              <li>Call: <a href="tel:8135170771" style="color:#1d4ed8;">(813) 517-0771</a> — Brandon</li>
              <li>Call: <a href="tel:9542711405" style="color:#1d4ed8;">(954) 271-1405</a> — Lake Worth</li>
            </ul>
            <p style="font-size:13px;color:#a1a1aa;margin-top:32px;">Team K5 Construction and Development Coordination<br/>Serving Florida &amp; Nationwide</p>
          </div>
        </div>
      `,
    });

    req.log.info({ name, email }, "Contact emails sent successfully");
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to send contact email");
    res.status(500).json({ error: "Failed to send message. Please call us directly." });
  }
});

export default router;
