import Image from "next/image";
import {
  MobileLiveDock,
  SignalTicker,
  SiteFooter,
  SiteHeader,
} from "./_components/SiteChrome";
import { BroadcastLink } from "./_components/BroadcastLink";
import { getUpcomingSchedule } from "./_lib/schedule";

export default async function Home() {
  const schedule = await getUpcomingSchedule(4);
  const nextShow = schedule[0];

  return (
    <main className="site-shell">
      <SiteHeader active="home" />
      <SignalTicker shows={schedule} />

      <section className="home-live" aria-labelledby="live-title">
        <BroadcastLink className="home-live-visual">
          <Image
            src="/accu-industrial-hero.png"
            alt="Industrial architecture in Limburg"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 72vw"
            className="live-visual-image"
          />
          <span className="live-visual-offline" aria-hidden="true">
            <Image
              src="/accu-symbol-white.png"
              alt=""
              width={3000}
              height={3000}
              sizes="(max-width: 900px) 52vw, 34vw"
            />
          </span>
          <div className="live-visual-shade" />
          <span className="live-visual-status">
            <i />
            <span className="when-live">Mixcloud live</span>
            <span className="when-archive">Listen again</span>
          </span>
          <span className="live-visual-play" aria-hidden="true">▶</span>
          <span className="live-visual-action">
            <span className="when-live">Enter live transmission ↗</span>
            <span className="when-archive">Play random audio broadcast ↗</span>
          </span>
        </BroadcastLink>

        <div className="home-live-info">
          <p className="section-kicker">
            {nextShow ? "Next transmission / TX-084" : "Schedule initializing"}
          </p>
          <h1 id="live-title">{nextShow?.artist ?? "New signals incoming"}</h1>
          <time>
            {nextShow
              ? `${nextShow.date} — ${nextShow.time} CET`
              : "More transmissions will be announced soon"}
          </time>
          <BroadcastLink className="primary-action">
            <span className="when-live">Watch & listen live</span>
            <span className="when-archive">Listen to a previous broadcast</span>
            <span aria-hidden="true">◉</span>
          </BroadcastLink>
        </div>
      </section>

      <section className="home-system" aria-labelledby="system-heading">
        <div className="system-manifesto">
          <div>
            <p className="section-kicker">Multidisciplinary music and art platform</p>
            <h2 id="system-heading">A connection<br />can unite.</h2>
            <p>
              Broadcasting the pulse of Limburg through electronic music, art,
              residents and guest signals.
            </p>
            <a href="/about">About ACCU ↗</a>
          </div>
        </div>
      </section>

      <SiteFooter />
      <MobileLiveDock />
    </main>
  );
}
