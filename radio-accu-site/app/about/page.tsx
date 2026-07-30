import Image from "next/image";
import { ChargeBar, PageIntro, SiteFooter, SiteHeader } from "../_components/SiteChrome";

export default function AboutPage() {
  return (
    <main className="site-shell">
      <SiteHeader active="about" />
      <PageIntro
        eyebrow="Module 06 / System overview"
        title="A connection can unite"
        description="ACCU is an independent community radio platform connecting electronic music, local culture and emerging voices from Limburg and beyond."
      />

      <section className="about-manifesto">
        <div className="about-logo">
          <Image src="/accu-chrome-logo-trimmed.png" alt="ACCU" width={3953} height={1533} />
        </div>
        <div>
          <p>
            Every transmission is a meeting point. Every resident strengthens the
            network. Every recording keeps independent culture visible and alive.
          </p>
          <p>
            Technology is our infrastructure, not our identity. Music is not
            content. It is culture.
          </p>
        </div>
      </section>

      <section className="about-values">
        {[
          ["01", "Independent", "Programming follows cultural value, not commercial pressure."],
          ["02", "Connected", "Artists, residents and listeners form one evolving community."],
          ["03", "Documented", "Broadcasts become a lasting audiovisual archive."],
          ["04", "Local / Open", "Rooted in Limburg and connected far beyond it."],
        ].map(([number, title, copy]) => (
          <article key={number}>
            <span>{number}</span><h2>{title}</h2><p>{copy}</p>
          </article>
        ))}
      </section>

      <section className="about-grid-status">
        <span>Grid status</span>
        <ChargeBar />
        <strong>Connected</strong>
        <a href="mailto:info@radioaccu.com">info@radioaccu.com ↗</a>
      </section>
      <SiteFooter />
    </main>
  );
}
