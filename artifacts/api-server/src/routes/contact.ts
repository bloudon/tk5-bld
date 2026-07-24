import { Router, type IRouter } from "express";
import { z } from "zod";

const router: IRouter = Router();

const ContactBody = z.object({
  name: z.string().min(1),
  company: z.string().optional(),
  email: z.string().email(),
  phone: z.string().min(1),
  service: z.string().min(1),
  message: z.string().min(1),
});

// TODO: wire up SMTP here — data is validated and ready to send
router.post("/contact", (req, res) => {
  const parsed = ContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid form data" });
    return;
  }

  req.log.info({ submission: parsed.data }, "Contact form submission received");
  res.json({ ok: true });
});

export default router;
