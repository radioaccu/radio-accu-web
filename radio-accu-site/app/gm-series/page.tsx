import { PageIntro, SiteFooter, SiteHeader } from "../_components/SiteChrome";
import { guestMixes } from "../_data/site";

export default function GuestMixPage() {
  return (
    <main className="site-shell">
      <SiteHeader active="gm" />
      <PageIntro
        eyebrow="Module 05 / Invitation only"
        title="Guest Mix Series"
        description="One-hour guest signals from invited DJs and producers whose sound deserves a dedicated place in the ACCU archive."
      />
      <section className="gm-page-grid">
        {guestMixes.map((mix, index) => (
          <article className={index === 0 ? "gm-page-card featured" : "gm-page-card"} key={mix.code}>
            <div className={`gm-page-image ${mix.crop}`}>
              <strong>{mix.code}</strong>
              <span>Exclusive signal</span>
            </div>
            <div className="gm-page-info">
              <h2>{mix.artist}</h2>
              <span>{mix.duration}</span>
              <span>{mix.location}</span>
              <b aria-hidden="true">▷</b>
            </div>
          </article>
        ))}
      </section>
      <SiteFooter />
    </main>
  );
}
