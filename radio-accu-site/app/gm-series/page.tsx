import { redirect } from "next/navigation";
import { PageTitle, SiteFooter, SiteHeader } from "../_components/SiteChrome";
import { getPublishedGuestMixes } from "../_lib/guest-mixes";

export default async function GuestMixPage() {
  if (process.env.GM_SERIES_ENABLED !== "true") redirect("/");

  const guestMixes = await getPublishedGuestMixes();

  return (
    <main className="site-shell">
      <SiteHeader active="gm" />
      <PageTitle>Guest Mix Series</PageTitle>
      {guestMixes.length > 0 ? (
        <section className="gm-page-grid">
          {guestMixes.map((mix, index) => (
            <article className={index === 0 ? "gm-page-card featured" : "gm-page-card"} key={mix.code}>
              <div
                className="gm-page-image"
                style={mix.artworkUrl ? {
                  backgroundImage: `linear-gradient(to top, rgba(0,0,0,.78), transparent 55%), url(${JSON.stringify(mix.artworkUrl)})`,
                } : undefined}
              >
              <strong>{mix.code}</strong>
              <span>Exclusive signal</span>
              </div>
              <div className="gm-page-info">
                <h2>{mix.artist}</h2>
                <span>{mix.duration}</span>
                <span>{mix.country || mix.releaseDate}</span>
                <b aria-hidden="true">▷</b>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="empty-schedule">
          <span>Archive syncing</span>
          <strong>New guest signals will appear here after publication.</strong>
        </section>
      )}
      <SiteFooter />
    </main>
  );
}
