import { AskMe } from "@/components/AskMe";
import { Boot } from "@/components/Boot";
import { CommandPalette } from "@/components/CommandPalette";
import { Field } from "@/components/Field";
import { Header } from "@/components/Header";
import { ScrollProgress } from "@/components/Kinetic";
import { Reticle } from "@/components/Reticle";
import { Reveal } from "@/components/Reveal";
import {
  About,
  BlockDiagram,
  Characteristics,
  Contact,
  Experience,
  Expertise,
  Footer,
  Leadership,
  PartHeader,
  Work,
} from "@/components/Sections";
import { projects, roles, site } from "@/lib/content";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  image: `${site.url}/profile.jpg`,
  jobTitle: site.role,
  email: `mailto:${site.email}`,
  sameAs: [site.linkedin],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Gurugram",
    addressCountry: "IN",
  },
  worksFor: { "@type": "Organization", name: roles[0].org },
  knowsAbout: [
    "Generative AI", "Large Language Models", "Retrieval-Augmented Generation",
    "Agentic AI", "Voice AI", "MLOps", "Computer Vision", "AI Engineering Leadership",
  ],
  hasOccupation: projects.map((p) => ({ "@type": "CreativeWork", name: p.title })),
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-stock"
      >
        Skip to content
      </a>
      {/* The room, behind everything: a lattice that answers to the pointer
          and shears with scroll velocity. Then the instruments on top of it —
          read position, a viewfinder tracking the pointer, and the boot the
          machine runs once per session. */}
      <Field />
      <ScrollProgress />
      <Reticle />
      <Boot />
      <Header />
      {/* No container here: every sheet owns its own container, so the measure
          is stated once per section rather than inherited from a wrapper. */}
      <main>
        <PartHeader />
        <Characteristics />
        <BlockDiagram />
        <Work />
        <Leadership />
        <Expertise />
        <Experience />
        <About />
        <Contact />
      </main>
      <Footer />
      <Reveal />
      <AskMe />
      {/* A machine takes commands. Everything in the palette is reachable
          another way, which is what makes it safe behind a keystroke. */}
      <CommandPalette />
    </>
  );
}
