import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro, SiteFooter, SiteHeader } from "../../_components/SiteChrome";
import { residents as fallbackResidents } from "../../_data/site";
import { getDropboxResidentDetail } from "../../_lib/dropbox";
import { getResidentImagePosition } from "../../_lib/resident-visuals";

type ResidentPageProps = {
  params: Promise<{ slug: string }>;
};

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: ResidentPageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${titleFromSlug(slug)} — ACCU Resident` };
}

export default async function ResidentPage({ params }: ResidentPageProps) {
  const { slug } = await params;
  const dropboxResident = await getDropboxResidentDetail(slug);
  const fallbackResident = fallbackResidents.find((candidate) => (
    candidate.dropboxFolder.split("/").pop() === slug
  ));
  const resident = dropboxResident ?? (fallbackResident ? {
    ...fallbackResident,
    bio: null,
    documents: [],
    folderPath: "",
    imagePath: null,
    photos: [],
    slug,
    socialLinks: [],
    videos: [],
  } : null);
  if (!resident) notFound();

  const leadPhoto = resident.photos.find((photo) => (
    photo.path === resident.imagePath
  )) ?? resident.photos[0];

  return (
    <main className="site-shell">
      <SiteHeader active="residents" />
      <PageIntro
        eyebrow="Module 04 / Resident"
        title={resident.name}
        description="Resident profile, biography and official listening and social channels."
      />

      <section className="resident-profile">
        <div
          className="resident-profile-visual"
          style={{
            "--resident-focus": getResidentImagePosition(resident.slug),
          } as CSSProperties}
        >
          {leadPhoto ? (
            <Image
              alt={`${resident.name} press image`}
              fill
              priority
              quality={92}
              sizes="(max-width: 800px) 100vw, 58vw"
              src={`/api/resident-media/${resident.slug}/${leadPhoto.id}`}
            />
          ) : (
            <div className="resident-profile-placeholder" aria-hidden="true" />
          )}
        </div>

        <article className="resident-biography">
          <p>Resident biography</p>
          <h2>{resident.bio ? `About ${resident.name}` : "Bio incoming"}</h2>
          <div className="resident-bio-copy">
            {resident.bio || "No written biography is connected to this Dropbox folder yet."}
          </div>
          <div className="resident-profile-links">
            <p>Listen / follow</p>
            {resident.socialLinks.length > 0 ? (
              <div>
                {resident.socialLinks.map((link) => (
                  <a href={link.href} key={link.href} target="_blank" rel="noreferrer">
                    {link.label} ↗
                  </a>
                ))}
              </div>
            ) : (
              <span>Official links incoming</span>
            )}
          </div>
          <Link href="/residents">← All residents</Link>
        </article>
      </section>

      <SiteFooter />
    </main>
  );
}
