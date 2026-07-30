import { PageIntro, SignalTicker, SiteFooter, SiteHeader } from "../_components/SiteChrome";
import { schedule } from "../_data/site";

export default function GridPage() {
  return (
    <main className="site-shell">
      <SiteHeader active="grid" />
      <SignalTicker />
      <PageIntro
        eyebrow="Module 02 / Transmission grid"
        title="Sunday programme"
        description="The full broadcast order for today. The current signal and every upcoming transmission remain visible in one clear timeline."
      />

      <section className="grid-page-schedule" aria-label="Sunday schedule">
        {schedule.map((show, index) => (
          <article className={show.status === "Now" ? "current" : ""} key={show.time}>
            <span>0{index + 1}</span>
            <time>{show.time}</time>
            <h2>{show.artist}</h2>
            <b>{show.status}</b>
          </article>
        ))}
      </section>
      <SiteFooter />
    </main>
  );
}
