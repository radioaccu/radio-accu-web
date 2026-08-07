import Link from "next/link";
import { DropboxAutoRefresh } from "../_components/DropboxAutoRefresh";
import { PageTitle, SiteFooter, SiteHeader } from "../_components/SiteChrome";
import { residents as fallbackResidents } from "../_data/site";
import { getDropboxResidents } from "../_lib/dropbox";

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
  const alphabeticalResidents = [...residents].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="site-shell">
      <DropboxAutoRefresh />
      <SiteHeader active="residents" />
      <PageTitle>Residents</PageTitle>

      <section className="residents-list" aria-label="ACCU residents">
        {alphabeticalResidents.map((resident) => (
          <Link
            aria-label={`Open ${resident.name} resident profile`}
            className="resident-list-item"
            href={`/residents/${resident.slug}`}
            key={resident.slug}
          >
            <h2>{resident.name}</h2>
            <span>Resident</span>
            <b>View profile ↗</b>
          </Link>
        ))}
      </section>
      <SiteFooter />
    </main>
  );
}
