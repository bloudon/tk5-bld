import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";

const base = import.meta.env.BASE_URL;

const slides = [
  {
    src: `${base}images/hero/window.webp`,
    alt: "Installers fitting a new impact window into the wall opening of a stucco home",
    label: "Window replacement",
  },
  {
    src: `${base}images/hero/roof.webp`,
    alt: "Roofers working on a residential roof with exposed decking and new underlayment",
    label: "Re-roofing",
  },
  {
    src: `${base}images/hero/framing.webp`,
    alt: "Wood-framed two-story house under construction with exposed studs and roof trusses",
    label: "New construction",
  },
];

const INTERVAL = 5000;

export function HeroRotator() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const playing = !paused && !reduced;

  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % slides.length), INTERVAL);
    return () => window.clearTimeout(t);
  }, [playing, index]);

  return (
    <div
      className="relative w-full"
      role="region"
      aria-roledescription="carousel"
      aria-label="Residential project types we coordinate permits for"
    >
      <div className="relative aspect-[4/3] lg:aspect-[5/4] w-full overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl">
        {slides.map((s, i) => (
          <img
            key={s.src}
            src={s.src}
            alt={s.alt}
            aria-hidden={i !== index}
            width={1200}
            height={1200}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 motion-reduce:transition-none ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-zinc-950/85 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 flex items-end justify-between gap-3 p-4">
          <div className="text-xs text-zinc-300" aria-live={playing ? "off" : "polite"}>
            <span className="block font-semibold uppercase tracking-widest text-white">{slides[index].label}</span>
            <span className="text-zinc-400">Representative imagery</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              {slides.map((s, i) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show image ${i + 1}: ${s.label}`}
                  aria-current={i === index}
                  className={`h-1.5 w-6 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ${
                    i === index ? "bg-white" : "bg-white/35 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              disabled={reduced}
              aria-pressed={paused || reduced}
              aria-label={playing ? "Pause image rotation" : "Resume image rotation"}
              title={reduced ? "Autoplay disabled by reduced-motion setting" : undefined}
              className="grid h-8 w-8 place-items-center border border-white/30 bg-zinc-950/60 text-white hover:bg-zinc-950/90 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
