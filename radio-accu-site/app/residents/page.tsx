import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { DropboxAutoRefresh } from "../_components/DropboxAutoRefresh";
import { PageTitle, SiteFooter, SiteHeader } from "../_components/SiteChrome";
import { residents as fallbackResidents } from "../_data/site";
import { getDropboxResidents, type DropboxResident } from "../_lib/dropbox";

export default async function ResidentsPage() {
  let dropboxResidents: DropboxResident[] = [];

  try {
    dropboxResidents = await getDropboxResidents();
  } catch (error) {
    unstable_rethrow(error);
    console.error(
      "[residents] Dropbox resident directory could not be loaded; using the local directory.",
      error instanceof Error ? error.message : "Unknown Dropbox error",
    );
  }

  const residents = dropboxResidents.length > 0
    ? dropboxResidents
    : fallbackResidents.map((resident) => ({
        slug: resident.dropboxFolder.split("/").pop() || resident.code.toLowerCase(),
        name: resident.name,
        imagePath: null,
        imageVersion: null,
      }));
  const alphabeticalResidents = residents
    .filter((resident) => resident.slug && resident.name)
    .sort((first, second) => {
      const firstName = first.name.toUpperCase();
      const secondName = second.name.toUpperCase();
      if (firstName < secondName) return -1;
      if (firstName > secondName) return 1;
      return 0;
    });

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
