import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro, SiteFooter, SiteHeader } from "../../_components/SiteChrome";
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
  const resident = await getDropboxResidentDetail(slug);
  if (!resident) notFound();

  const leadPhoto = resident.photos.find((photo) => (
    photo.path === resident.imagePath
  )) ?? resident.photos[0];

  return (
    <main className="site-shell">
      <SiteHeader active="residents" />
      <PageIntro
        eyebrow="Module 04 / Resident node"
        title={resident.name}
        description={`${resident.photos.length} images · ${resident.videos.length} videos · connected through the Radio ACCU resident network.`}
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
          <span>NODE / {resident.name}</span>
        </div>

        <article className="resident-biography">
          <p>Resident biography</p>
          <h2>{resident.bio ? "About this node" : "Bio incoming"}</h2>
          <div className="resident-bio-copy">
            {resident.bio || "No written biography is connected to this Dropbox folder yet."}
          </div>
          <Link href="/residents">← All residents</Link>
        </article>
      </section>

      {resident.photos.length > 0 && (
        <section className="resident-media-section">
          <header>
            <p>Resident image bank</p>
            <span>{String(resident.photos.length).padStart(2, "0")} photographs</span>
          </header>
          <div className="resident-photo-grid">
            {resident.photos.map((photo, index) => (
              <figure className={index % 5 === 0 ? "wide" : ""} key={photo.id}>
                <Image
                  alt={`${resident.name} — ${photo.name}`}
                  fill
                  quality={92}
                  sizes={index % 5 === 0
                    ? "(max-width: 800px) 100vw, 66vw"
                    : "(max-width: 800px) 100vw, 33vw"}
                  src={`/api/resident-media/${resident.slug}/${photo.id}`}
                />
                <figcaption>{photo.name}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {resident.videos.length > 0 && (
        <section className="resident-media-section">
          <header>
            <p>Resident motion archive</p>
            <span>{String(resident.videos.length).padStart(2, "0")} videos</span>
          </header>
          <div className="resident-video-grid">
            {resident.videos.map((video) => (
              <article key={video.id}>
                <video
                  controls
                  playsInline
                  preload="none"
                  src={`/api/resident-media/${resident.slug}/${video.id}`}
                />
                <p>{video.name}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {resident.photos.length === 0 && resident.videos.length === 0 && (
        <section className="page-cta resident-empty-state">
          <p>Media bank</p>
          <h2>This resident folder is connected and ready for new assets.</h2>
        </section>
      )}

      <SiteFooter />
    </main>
  );
}
