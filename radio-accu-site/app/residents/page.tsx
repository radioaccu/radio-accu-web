import type { CSSProperties } from "react";
import { PageIntro, PixelMark, SiteFooter, SiteHeader } from "../_components/SiteChrome";
import { residents } from "../_data/site";

export default function ResidentsPage() {
  return (
    <main className="site-shell">
      <SiteHeader active="residents" />
      <PageIntro
        eyebrow="Module 04 / Residents"
        title="Connected residents"
        description="The recurring voices shaping the station’s sound, archive and community. Each resident is a node in the wider ACCU network."
      />

      <section className="residents-grid" aria-label="ACCU residents">
        {residents.map((resident) => (
          <article className="resident-card" key={resident.code}>
            <div
              className={`resident-image ${resident.crop}`}
              style={{
                "--resident-image": `url("/api/resident-image/${resident.dropboxFolder.split("/").at(-1)}/profile.jpg")`,
              } as CSSProperties}
            >
              <span>{resident.code}</span>
              <PixelMark />
            </div>
            <div className="resident-info">
              <div><span>Resident</span><h2>{resident.name}</h2></div>
              <div><span>Signal range</span><p>{resident.genre}</p></div>
              <b aria-hidden="true">↗</b>
            </div>
          </article>
        ))}
      </section>

      <section className="page-cta">
        <p>Resident directory</p>
        <h2>More profiles will connect as the grid expands.</h2>
        <a href="mailto:info@radioaccu.com">Connect with ACCU →</a>
      </section>
      <SiteFooter />
    </main>
  );
}
