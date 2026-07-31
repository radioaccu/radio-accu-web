import Image from "next/image";
import { PageIntro, SiteFooter, SiteHeader } from "../_components/SiteChrome";

export default function AboutPage() {
  return (
    <main className="site-shell">
      <SiteHeader active="about" />
      <PageIntro
        eyebrow="Module 06 / System overview"
        title="A connection can unite"
        description="Music, art, radio, livestreams, events, club nights and a label — one multidisciplinary platform."
      />

      <section className="about-manifesto">
        <div className="about-logo">
          <Image src="/accu-chrome-logo-trimmed.png" alt="ACCU" width={3953} height={1533} />
        </div>
        <div className="about-copy">
          <p className="about-lead">
            ACCU is a new multidisciplinary music and art platform that blurs
            boundaries and amplifies creative energy. Built on a deep belief in
            the power of artistic expression, ACCU unites art exhibitions, radio
            and livestreams, music events, club nights, and its own label under
            one roof. The project acts as a dynamic hub where creators, audiences,
            and nightlife communities come together, inspire each other, and
            spark new ideas.
          </p>
          <div className="about-collaboration">
            <span>In collaboration with De Serre</span>
            <p>
              ACCU is grateful to De Serre for opening their space to the project.
              This collaboration gives artists, broadcasts and audiences a place
              to meet, create and build a shared cultural community in Hasselt.
            </p>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
