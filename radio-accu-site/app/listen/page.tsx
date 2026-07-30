import Link from "next/link";
import { ArchiveAudioPlayer } from "../_components/ArchiveAudioPlayer";
import { SignalTicker, SiteFooter, SiteHeader } from "../_components/SiteChrome";
import { getUpcomingSchedule } from "../_lib/schedule";

export default async function ListenPage() {
  const schedule = await getUpcomingSchedule(4);

  return (
    <main className="site-shell">
      <SiteHeader active="home" />
      <SignalTicker shows={schedule} />

      <ArchiveAudioPlayer />

      <section className="listen-context">
        <p>About this relay</p>
        <div>
          <h2>No live broadcast right now.</h2>
          <p>
            ACCU automatically selects a previous Radio ACCU audio broadcast.
            The player stays inside the website; use “Randomise signal” for
            another archived show.
          </p>
          <Link href="/archive">Browse the video archive ↗</Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
