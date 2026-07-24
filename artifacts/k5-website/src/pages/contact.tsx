import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Contact() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to send");
      }
      toast({
        title: "Message received.",
        description: "A member of Team K5 will contact you within 1 business day.",
      });
      setForm({ name: "", company: "", email: "", phone: "", service: "", message: "" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please call us directly.";
      toast({ title: "Couldn't send your message", description: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pt-20">
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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" required value={form.name} onChange={set("name")} placeholder="John Doe" className="rounded-none bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" value={form.company} onChange={set("company")} placeholder="Acme Construction" className="rounded-none bg-background" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" required value={form.email} onChange={set("email")} placeholder="john@example.com" className="rounded-none bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" required value={form.phone} onChange={set("phone")} placeholder="(555) 123-4567" className="rounded-none bg-background" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service">Interested Service</Label>
                  <Select required value={form.service} onValueChange={v => setForm(prev => ({ ...prev, service: v }))}>
                    <SelectTrigger className="rounded-none bg-background">
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
                <div className="space-y-4 text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <span>(407) 469-5599</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <a href="mailto:permitting@expeditepermit.com" className="hover:underline">permitting@expeditepermit.com</a>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold font-serif text-foreground mb-6">Our Offices</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <MapPin className="h-6 w-6 text-primary shrink-0" />
                    <div>
                      <h4 className="font-bold text-foreground">Clermont (Central FL)</h4>
                      <p className="text-sm text-muted-foreground mt-1">Clermont, FL</p>
                      <a href="tel:4074695599" className="text-sm text-primary hover:underline mt-1 inline-block">(407) 469-5599</a>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <MapPin className="h-6 w-6 text-primary shrink-0" />
                    <div>
                      <h4 className="font-bold text-foreground">Brandon (Tampa Bay)</h4>
                      <p className="text-sm text-muted-foreground mt-1">Brandon, FL</p>
                      <a href="tel:8135170771" className="text-sm text-primary hover:underline mt-1 inline-block">(813) 517-0771</a>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <MapPin className="h-6 w-6 text-primary shrink-0" />
                    <div>
                      <h4 className="font-bold text-foreground">Lake Worth (South FL)</h4>
                      <p className="text-sm text-muted-foreground mt-1">Lake Worth, FL</p>
                      <a href="tel:9542711405" className="text-sm text-primary hover:underline mt-1 inline-block">(954) 271-1405</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-950 p-6 text-white">
                <h4 className="font-bold font-serif mb-2 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" /> Nationwide Service
                </h4>
                <p className="text-sm text-zinc-400">
                  While our roots and physical offices are in Florida, our processes and expertise scale. We handle coordination and expediting for clients across the Southeast United States and nationally.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
