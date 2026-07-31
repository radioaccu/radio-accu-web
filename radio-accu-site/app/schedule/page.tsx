import { PageIntro, SignalTicker, SiteFooter, SiteHeader } from "../_components/SiteChrome";
import { getUpcomingSchedule } from "../_lib/schedule";

export default async function SchedulePage() {
  const schedule = await getUpcomingSchedule();
  const months = new Map<string, {
    dates: Map<string, typeof schedule>;
    label: string;
    total: number;
  }>();

  for (const show of schedule) {
    const monthKey = show.startsAt.slice(0, 7);
    const month = months.get(monthKey) ?? {
      dates: new Map<string, typeof schedule>(),
      label: new Intl.DateTimeFormat("en-GB", {
        month: "long",
        timeZone: "Europe/Brussels",
        year: "numeric",
      }).format(new Date(show.startsAt)),
      total: 0,
    };
    const day = month.dates.get(show.date) ?? [];
    day.push(show);
    month.dates.set(show.date, day);
    month.total += 1;
    months.set(monthKey, month);
  }

  const scheduleByMonth = Array.from(months);

  return (
    <main className="site-shell">
      <SiteHeader active="schedule" />
      <SignalTicker shows={schedule.slice(0, 4)} />
      <PageIntro
        eyebrow="Module 02 / Schedule"
        title="Monthly schedule"
        description="Browse every confirmed broadcast day by month. Regular Sunday transmissions run from 14:00 until 18:00; earlier starts and extended broadcasts are read directly from the live spreadsheet."
      />

      <section className="grid-page-schedule" aria-label="Upcoming Radio ACCU schedule">
        {scheduleByMonth.length > 0 ? (
          scheduleByMonth.map(([monthKey, month]) => (
            <section className="schedule-month" key={monthKey}>
              <header>
                <h2>{month.label}</h2>
                <span>
                  {String(month.dates.size).padStart(2, "0")} broadcast days ·{" "}
                  {String(month.total).padStart(2, "0")} transmissions
                </span>
              </header>
              {Array.from(month.dates).map(([date, shows]) => (
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
