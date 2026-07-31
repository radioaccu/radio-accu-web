import type { CSSProperties } from "react";
import Link from "next/link";
import { PageIntro, SiteFooter, SiteHeader } from "../_components/SiteChrome";
import { residents as fallbackResidents } from "../_data/site";
import { getDropboxResidents } from "../_lib/dropbox";
import { getResidentImagePosition } from "../_lib/resident-visuals";

export default async function ResidentsPage() {
  const dropboxResidents = await getDropboxResidents();
  const residents = dropboxResidents.length > 0
    ? dropboxResidents
    : fallbackResidents.map((resident) => ({
        slug: resident.dropboxFolder.split("/").at(-1) ?? resident.code.toLowerCase(),
        name: resident.name,
        imagePath: null,
      }));

  return (
    <main className="site-shell">
      <SiteHeader active="residents" />
      <PageIntro
        eyebrow="Module 04 / Residents"
        title="Connected residents"
        description="The recurring voices shaping the station’s sound, archive and community. Each resident is a node in the wider ACCU network."
      />

      <section className="residents-grid" aria-label="ACCU residents">
        {residents.map((resident, index) => (
          <Link
            aria-label={`Open ${resident.name} resident profile`}
            className="resident-card"
            href={`/residents/${resident.slug}`}
            key={resident.slug}
          >
            <div
              className={`resident-image crop-${["a", "b", "c", "d"][index % 4]}`}
              style={{
                "--resident-image": `url("/api/resident-image/${resident.slug}?v=2")`,
                "--resident-focus": getResidentImagePosition(resident.slug),
              } as CSSProperties}
            />
            <div className="resident-info">
              <div><span>Resident</span><h2>{resident.name}</h2></div>
              <div>
                <span>Asset status</span>
                <p>{resident.imagePath ? "Dropbox connected" : "Image incoming"}</p>
              </div>
              <b aria-hidden="true">↗</b>
            </div>
          </Link>
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
