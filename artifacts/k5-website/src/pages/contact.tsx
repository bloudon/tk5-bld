import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Building2, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getAttribution, track } from "@/analytics";
import { COMPANY } from "@/site";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Contact() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    service: "",
    market: "",
    message: "",
  });
  const started = useRef(false);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, attribution: getAttribution() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to send");
      }
      toast({
        title: "Message received.",
        description: `${COMPANY.displayName} will contact you within 1 business day.`,
      });
      track("generate_lead", {
        requested_service: form.service,
        requested_market: form.market,
        ...getAttribution(),
      });
      setSubmitted(true);
      setForm({ name: "", company: "", email: "", phone: "", service: "", market: "", message: "" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please call us directly.";
      toast({ title: "Couldn't send your message", description: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <section className="py-20 bg-zinc-950 text-white relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888081622-1bb5924ddc79?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">Let's Get to Work</h1>
            <p className="text-xl text-zinc-400 font-light leading-relaxed">
              Tell us about your project. We'll tell you exactly how we can expedite it.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card border border-border p-8 shadow-sm"
            >
              <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Send us a message</h2>
              {submitted && (
                <div role="status" className="mb-6 border border-emerald-300 bg-emerald-50 p-4 text-emerald-950">
                  <p className="font-bold">Thank you. Your request was confirmed.</p>
                  <p className="mt-1 text-sm">
                    {COMPANY.displayName} will contact you within 1 business day. For urgent questions, call{" "}
                    <a href={COMPANY.phoneHref} className="font-semibold underline">{COMPANY.phoneDisplay}</a>.
                  </p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6" onFocus={() => {
                if (!started.current) {
                  started.current = true;
                  track("form_start", { form_name: "contact_request", ...getAttribution() });
                }
              }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" required value={form.name} onChange={set("name")} autoComplete="name" className="rounded-none bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" value={form.company} onChange={set("company")} autoComplete="organization" className="rounded-none bg-background" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" required value={form.email} onChange={set("email")} autoComplete="email" className="rounded-none bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" required value={form.phone} onChange={set("phone")} autoComplete="tel" className="rounded-none bg-background" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="market">Requested Service Area / Market</Label>
                  <Select required value={form.market} onValueChange={v => {
                    setForm(prev => ({ ...prev, market: v }));
                    track("market_selected", { requested_market: v, ...getAttribution() });
                  }}>
                    <SelectTrigger id="market" className="rounded-none bg-background"><SelectValue placeholder="Select a market" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clermont-central-florida">Clermont / Central Florida</SelectItem>
                      <SelectItem value="brandon-tampa-bay">Brandon / Tampa Bay</SelectItem>
                      <SelectItem value="lake-worth-south-florida">Lake Worth / South Florida</SelectItem>
                      <SelectItem value="other-national">Other / National coordination</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service">Interested Service</Label>
                  <Select required value={form.service} onValueChange={v => {
                    setForm(prev => ({ ...prev, service: v }));
                    track("service_selected", { requested_service: v, ...getAttribution() });
                  }}>
                    <SelectTrigger id="service" className="rounded-none bg-background">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="permit-residential">Permit Expediting – Residential</SelectItem>
                      <SelectItem value="permit-commercial">Permit Expediting – Commercial</SelectItem>
                      <SelectItem value="inspection">Inspection Scheduling</SelectItem>
                      <SelectItem value="erecording">E-Recording</SelectItem>
                      <SelectItem value="notary-traditional">Traditional Notary</SelectItem>
                      <SelectItem value="notary-ron">Remote Online Notary (RON)</SelectItem>
                      <SelectItem value="other">Other / Not Sure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Project Details</Label>
                  <Textarea
                    id="message"
                    required
                    value={form.message}
                    onChange={set("message")}
                    placeholder="Tell us about the municipality, scope, and timeline..."
                    className="min-h-[150px] rounded-none bg-background resize-none"
                  />
                </div>

                <Button type="submit" size="lg" disabled={submitting} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-14">
                  {submitting ? "Sending…" : "Submit Request"}
                </Button>
              </form>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <div>
                <h3 className="text-xl font-bold font-serif text-foreground mb-4">Direct Contact</h3>
                <p className="text-sm font-semibold text-foreground mb-4">{COMPANY.displayName}</p>
                <div className="space-y-4 text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <a href={COMPANY.phoneHref} className="hover:underline">{COMPANY.phoneDisplay}</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <a href={`mailto:${COMPANY.email}`} className="hover:underline">{COMPANY.email}</a>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold font-serif text-foreground mb-6">Florida Service Areas</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <MapPin className="h-6 w-6 text-primary shrink-0" />
                    <div>
                       <h4 className="font-bold text-foreground">Clermont / Central Florida</h4>
                       <p className="text-sm text-muted-foreground mt-1">Service area — not presented as a staffed office</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <MapPin className="h-6 w-6 text-primary shrink-0" />
                    <div>
                       <h4 className="font-bold text-foreground">Brandon / Tampa Bay</h4>
                       <p className="text-sm text-muted-foreground mt-1">Service area — not presented as a staffed office</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <MapPin className="h-6 w-6 text-primary shrink-0" />
                    <div>
                       <h4 className="font-bold text-foreground">Lake Worth / South Florida</h4>
                       <p className="text-sm text-muted-foreground mt-1">Service area — not presented as a staffed office</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-950 p-6 text-white">
                <h4 className="font-bold font-serif mb-2 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" /> Nationwide Service
                </h4>
                <p className="text-sm text-zinc-400">
                  Our Florida service areas include Clermont, Brandon, and Lake Worth. Our processes and expertise also support coordination and expediting across the Southeast United States and nationally.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
