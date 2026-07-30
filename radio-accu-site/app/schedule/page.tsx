import { PageIntro, SignalTicker, SiteFooter, SiteHeader } from "../_components/SiteChrome";
import { schedule } from "../_data/site";

export default function SchedulePage() {
  return (
    <main className="site-shell">
      <SiteHeader active="schedule" />
      <SignalTicker />
      <PageIntro
        eyebrow="Module 02 / Schedule"
        title="Upcoming transmissions"
        description="Four confirmed Radio ACCU broadcasts on four different dates. Future additions will automatically join this chronological schedule."
      />

      <section className="grid-page-schedule" aria-label="Upcoming Radio ACCU schedule">
        {schedule.map((show, index) => (
          <article key={show.startsAt}>
            <span>0{index + 1}</span>
            <time>{show.date}</time>
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
