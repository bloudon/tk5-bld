import casaMia from "../assets/clients/casa-mia.png";
import ultra from "../assets/clients/ultra.jpg";
import atiRestoration from "../assets/clients/ati-restoration.png";
import finiteReimagining from "../assets/clients/finite-reimaging.png";
import firstImpression from "../assets/clients/first-impression.jpg";
import posada from "../assets/clients/posada.png";
import sgc from "../assets/clients/sgc.webp";
import atlanticArmor from "../assets/clients/atlantic-armor.png";
import axe from "../assets/clients/axe.webp";
import bigCountry from "../assets/clients/big-country.png";
import beyondBuilders from "../assets/clients/beyond-builders.png";
import dreamTeam from "../assets/clients/dream-team.webp";
import envera from "../assets/clients/envera.png";
import homeDepot from "../assets/clients/home-depot.jpg";
import dyad from "../assets/clients/dyad.jpg";
import i4Capital from "../assets/clients/i4-capital.png";
import camp from "../assets/clients/camp.png";
import pella from "../assets/clients/pella.png";
import jaxDW from "../assets/clients/jax-dw.webp";
import localAC from "../assets/clients/local-ac.png";
import gulfCoast from "../assets/clients/gulf-coast.png";
import phoenix from "../assets/clients/phoenix.webp";

const logos = [
  { src: posada, alt: "Posada Custom Homes" },
  { src: sgc, alt: "Surfaces Construction Group" },
  { src: atlanticArmor, alt: "Atlantic Armor" },
  { src: axe, alt: "AXE General Contractor" },
  { src: bigCountry, alt: "Big Country Contracting" },
  { src: beyondBuilders, alt: "Beyond Builders" },
  { src: dreamTeam, alt: "Dream Team Roofing" },
  { src: envera, alt: "Envera" },
  { src: homeDepot, alt: "The Home Depot" },
  { src: dyad, alt: "Dyad Construction" },
  { src: i4Capital, alt: "i4 Capital Group" },
  { src: camp, alt: "CAMP Facility Services" },
  { src: pella, alt: "Pella" },
  { src: jaxDW, alt: "Jacksonville Doors & Windows" },
  { src: localAC, alt: "Local AC Heating & Cooling" },
  { src: gulfCoast, alt: "Gulf Coast Restoration & Construction" },
  { src: phoenix, alt: "Phoenix Aluminum Products" },
  { src: casaMia, alt: "Casa Mia Services" },
  { src: ultra, alt: "Ultra Property Damage" },
  { src: atiRestoration, alt: "ATI Restoration" },
  { src: finiteReimagining, alt: "Finite Reimaging" },
  { src: firstImpression, alt: "First Impression Doors & More" },
];

export function ClientMarquee() {
  return (
    <section className="py-14 bg-zinc-50 border-y border-zinc-200">
      <div className="text-center mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
          Trusted by Leading Contractors &amp; Builders
        </p>
      </div>

      <div
        className="relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className="flex gap-14 w-max animate-marquee">
          {[...logos, ...logos].map((logo, i) => (
            <div
              key={i}
              className="flex items-center justify-center h-14 w-36 shrink-0 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
