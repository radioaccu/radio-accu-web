import { PageIntro, SignalTicker, SiteFooter, SiteHeader } from "../_components/SiteChrome";
import { getUpcomingSchedule } from "../_lib/schedule";

export default async function SchedulePage() {
  const schedule = await getUpcomingSchedule();
  const scheduleByDate = Array.from(
    schedule.reduce((dates, show) => {
      const shows = dates.get(show.date) ?? [];
      shows.push(show);
      dates.set(show.date, shows);
      return dates;
    }, new Map<string, typeof schedule>()),
  );

  return (
    <main className="site-shell">
      <SiteHeader active="schedule" />
      <SignalTicker shows={schedule.slice(0, 4)} />
      <PageIntro
        eyebrow="Module 02 / Schedule"
        title="Upcoming transmissions"
        description="Every confirmed timeslot is shown independently. Broadcast days normally run from 14:00 until 18:00, while earlier starts and extended transmissions are read directly from the schedule."
      />

      <section className="grid-page-schedule" aria-label="Upcoming Radio ACCU schedule">
        {scheduleByDate.length > 0 ? (
          scheduleByDate.map(([date, shows]) => (
            <section className="schedule-day" key={date}>
              <header>
                <time>{date}</time>
                <span>{String(shows.length).padStart(2, "0")} transmissions</span>
              </header>
              {shows.map((show, index) => (
                <article key={`${show.startsAt}-${show.artist}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <time>{show.time}</time>
                  <h2>{show.artist}</h2>
                  <b>{show.status}</b>
                </article>
              ))}
            </section>
          ))
        ) : (
          <div className="empty-schedule">
            <span>Schedule initializing</span>
            <strong>New signals will be announced soon.</strong>
          </div>
        )}
      </section>
      <SiteFooter />
    </main>
  );
}
