import { ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import type { LandingPage as LandingPageContent } from "@/landing-pages";

export default function LandingPage({ page }: { page: LandingPageContent }) {
  const intake = `/contact?service=${encodeURIComponent(page.service)}${page.market ? `&market=${encodeURIComponent(page.market)}` : ""}`;
  return <article>
    <header className="bg-zinc-950 py-20 text-white">
      <div className="container mx-auto max-w-5xl px-4">
        <p className="mb-4 text-sm font-bold uppercase tracking-[.2em] text-primary">{page.eyebrow}</p>
        <h1 className="max-w-4xl font-serif text-4xl font-bold leading-tight md:text-6xl">{page.title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-zinc-300 md:text-xl">{page.intro}</p>
        <Button asChild size="lg" className="mt-8 h-14 rounded-none px-8"><Link href={intake}>Discuss your project <ArrowRight className="ml-2 h-5 w-5"/></Link></Button>
      </div>
    </header>

    <section className="py-20"><div className="container mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-[1.4fr_.6fr]">
      <div><h2 className="font-serif text-3xl font-bold">{page.overviewTitle}</h2>
        <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted-foreground">{page.overview.map(text=><p key={text}>{text}</p>)}</div>
      </div>
      <aside className="border border-border bg-zinc-50 p-7">
        <h2 className="font-serif text-2xl font-bold">Why this process is credible</h2>
        <ul className="mt-5 space-y-4">{page.proof.map(item=><li key={item} className="flex gap-3"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary"/><span>{item}</span></li>)}</ul>
      </aside>
    </div></section>

    <section className="border-y border-border bg-zinc-50 py-20"><div className="container mx-auto max-w-6xl px-4">
      <h2 className="font-serif text-3xl font-bold">How the work moves forward</h2>
      <ol className="mt-10 grid gap-6 md:grid-cols-2">{page.process.map((step,i)=><li key={step.title} className="border border-border bg-white p-7"><p className="text-sm font-bold text-primary">STEP {i+1}</p><h3 className="mt-2 font-serif text-xl font-bold">{step.title}</h3><p className="mt-3 leading-relaxed text-muted-foreground">{step.text}</p></li>)}</ol>
    </div></section>

    <section className="py-20"><div className="container mx-auto grid max-w-6xl gap-14 px-4 lg:grid-cols-2">
      <div><h2 className="font-serif text-3xl font-bold">Frequently asked questions</h2><div className="mt-8 divide-y divide-border">{page.faqs.map(faq=><div key={faq.question} className="py-6 first:pt-0"><h3 className="text-lg font-bold">{faq.question}</h3><p className="mt-2 leading-relaxed text-muted-foreground">{faq.answer}</p></div>)}</div></div>
      <div className="space-y-10">
        <div><h2 className="font-serif text-3xl font-bold">Useful resources</h2><ul className="mt-6 space-y-3">{page.resources.map(resource=><li key={resource.href}>{resource.external?<a href={resource.href} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline underline-offset-4">{resource.label}<ExternalLink className="ml-1 inline h-4 w-4"/><span className="sr-only"> (opens in a new tab)</span></a>:<Link href={resource.href} className="font-semibold text-primary underline underline-offset-4">{resource.label}</Link>}</li>)}</ul></div>
        <nav aria-label="Related services and markets"><h2 className="font-serif text-3xl font-bold">Related help</h2><ul className="mt-6 space-y-3">{page.related.map(item=><li key={item.href}><Link href={item.href} className="font-semibold text-primary underline underline-offset-4">{item.label}</Link></li>)}</ul></nav>
      </div>
    </div></section>

    <section className="bg-primary py-16 text-center text-primary-foreground"><div className="container mx-auto px-4"><h2 className="font-serif text-3xl font-bold text-white">Bring us the address, scope, and target schedule.</h2><p className="mx-auto mt-4 max-w-2xl text-lg">We’ll use those facts to route your request and explain the next practical coordination step.</p><Button asChild size="lg" className="mt-7 h-14 rounded-none bg-zinc-950 px-8 text-white hover:bg-zinc-800"><Link href={intake}>Start project intake <ArrowRight className="ml-2 h-5 w-5"/></Link></Button></div></section>
  </article>;
}