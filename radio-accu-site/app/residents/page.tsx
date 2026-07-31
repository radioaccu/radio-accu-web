import type { CSSProperties } from "react";
import Link from "next/link";
import { DropboxAutoRefresh } from "../_components/DropboxAutoRefresh";
import { SiteFooter, SiteHeader } from "../_components/SiteChrome";
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
        imageVersion: null,
      }));

  return (
    <main className="site-shell">
      <DropboxAutoRefresh />
      <SiteHeader active="residents" />
      <section className="residents-intro" aria-labelledby="residents-heading">
        <h1 id="residents-heading">Residents</h1>
      </section>

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
                "--resident-image": `url("/api/resident-image/${resident.slug}?v=${encodeURIComponent(resident.imageVersion ?? "1")}")`,
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
      <SiteFooter />
    </main>
  );
}
