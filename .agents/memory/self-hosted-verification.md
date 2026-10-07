---
name: Self-hosted verification
description: User decision to use reusable independent ALTCHA protection on the VPS
---
Use self-hosted ALTCHA rather than Turnstile for contact-form protection.

**Why:** The user requested self-hosting and portability to other VPS applications without separate verification services.

**How to apply:** Reuse integration code but keep secrets, challenge state and limits independent per app. Do not replace it with a hosted CAPTCHA provider without user approval.
