import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Building2, FileText, ClipboardCheck, ShieldCheck, MapPin } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ClientMarquee } from "@/components/client-marquee";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-zinc-950 text-white overflow-hidden min-h-[90vh] flex items-center pt-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888081622-1bb5924ddc79?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-primary text-primary-foreground text-xs md:text-sm font-bold tracking-widest uppercase mb-8 border-l-4 border-white/20 shadow-xl">
              Est. 2003 • Florida & Nationwide
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight mb-8 leading-[1.05] text-white">
              We know the system because <span className="text-primary italic font-light">we built it.</span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-lg md:text-2xl text-zinc-300 mb-10 max-w-2xl leading-relaxed font-light">
              Team K5 Construction &amp; Development Coordination provides expert permit expediting and coordination. Stop fighting red tape and let the insiders handle your paperwork.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/contact">
                <Button size="lg" className="h-14 px-8 text-base shadow-xl bg-primary text-primary-foreground hover:bg-primary/90 rounded-none">
                  Start Your Project <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline" className="h-14 px-8 text-base shadow-xl bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white rounded-none backdrop-blur-sm">
                  View Services
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Trust Bar at bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-zinc-950/50 backdrop-blur-md">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 text-sm font-medium text-zinc-300">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>20+ Years Experience</span>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-primary" />
                <span>3 Florida Service Areas</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span>Former Building Official</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span>Serving SE USA & Nationally</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ClientMarquee />

      {/* Services Highlight */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6">Cut through the bureaucracy.</h2>
            <p className="text-lg text-muted-foreground">
              We specialize in keeping your projects moving. From single permits to massive commercial developments, our established relationships and deep knowledge of the system ensure nothing stalls.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FileText className="h-10 w-10 text-primary" />,
                title: "Permit Expediting",
                description: "We handle the entire submittal process. By catching errors before they hit the reviewer's desk, we shave weeks off your timeline.",
                href: "/services/permit-expediting",
              },
              {
                icon: <ClipboardCheck className="h-10 w-10 text-primary" />,
                title: "Inspection Scheduling",
                description: "Strategic coordination of your inspections to prevent dead days on site. We know how the schedules work and how to keep inspectors happy.",
                href: "/services/inspection-scheduling",
              },
              {
                icon: <Building2 className="h-10 w-10 text-primary" />,
                title: "E-Recording",
                description: "Fast, compliant electronic document recording. NOCs, NOC terminations, and critical project documents handled digitally for speed.",
                href: "/services/e-recording-notice-of-commencement",
              }
            ].map((service, i) => (
              <motion.div 
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }
                }}
                className="bg-card border border-border p-8 hover:border-primary/50 transition-colors shadow-sm relative group overflow-hidden"
              >
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/20 transition-all"></div>
                <div className="mb-6">{service.icon}</div>
                <h3 className="text-xl font-bold font-serif mb-4 text-card-foreground">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">{service.description}</p>
                <Link href={service.href} className="text-primary font-semibold flex items-center text-sm group-hover:underline">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Insider Advantage */}
      <section className="py-24 bg-zinc-50 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-zinc-900 mb-6">The Insider Advantage</h2>
              <div className="space-y-6 text-lg text-zinc-600">
                <p>
                  Team K5 was founded in 2003 by a former building official and inspector with Florida municipal experience who saw contractors struggle because they did not speak the building department's language.
                </p>
                <p>
                  Team K5 was created to bridge that gap and still operates on the same principle: <strong>to get paper moved, you need to think like the person reviewing it.</strong>
                </p>
                <ul className="space-y-4 pt-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                    <span className="font-medium text-zinc-900">We pre-screen submittals to catch the mistakes that trigger rejections.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                    <span className="font-medium text-zinc-900">We maintain relationships with municipalities across Florida.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                    <span className="font-medium text-zinc-900">We speak the language of code compliance and zoning.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-10">
                <Link href="/about">
                  <Button variant="outline" className="border-zinc-300 text-zinc-900 hover:bg-zinc-100 rounded-none h-12 px-6">
                    Read Our Story
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-[600px] w-full"
            >
              <div className="absolute inset-0 bg-zinc-200">
                <img 
                  src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2831&auto=format&fit=crop" 
                  alt="Construction blueprints and planning" 
                  className="w-full h-full object-cover grayscale opacity-90 mix-blend-multiply"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-primary z-[-1]"></div>
              <div className="absolute -top-6 -right-6 w-48 h-48 border-4 border-zinc-200 z-[-1]"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-white">Stop waiting on the building department.</h2>
          <p className="text-xl text-primary-foreground/90 mb-10 font-light">
            Whether you need a single residential window permit or a massive commercial coordination plan, Team K5 has the expertise to get it done.
          </p>
          <Link href="/contact">
            <Button size="lg" className="h-14 px-10 text-lg bg-zinc-950 text-white hover:bg-zinc-800 rounded-none shadow-xl border-none">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
