import Image from "next/image";
import Link from "next/link";
import {
  MobileLiveDock,
  SignalTicker,
  SiteFooter,
  SiteHeader,
} from "./_components/SiteChrome";
import { BroadcastLink } from "./_components/BroadcastLink";
import { VideoCard } from "./_components/VideoCard";
import { schedule, videos, YOUTUBE_CHANNEL_URL } from "./_data/site";

export default function Home() {
  return (
    <main className="site-shell">
      <SiteHeader active="home" />
      <SignalTicker />

      <section className="home-live" aria-labelledby="live-title">
        <BroadcastLink className="home-live-visual">
          <Image
            src="/accu-industrial-hero.png"
            alt="Industrial architecture in Limburg"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 72vw"
          />
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
          <p className="section-kicker">Next transmission / TX-084</p>
          <h1 id="live-title">Vincent<br />Neumann</h1>
          <time>02 Aug 2026 — 14:00 CET</time>
          <BroadcastLink className="primary-action">
            <span className="when-live">Watch & listen live</span>
            <span className="when-archive">Listen to a previous broadcast</span>
            <span aria-hidden="true">◉</span>
          </BroadcastLink>
          <div className="next-signal">
            <span>Following transmission</span>
            <strong>Bashti</strong>
            <time>09 Aug — 14:00</time>
          </div>
        </div>
      </section>

      <section className="content-section previous-broadcasts" aria-labelledby="previous-heading">
        <header className="section-heading">
          <div>
            <p>Signal history / YouTube</p>
            <h2 id="previous-heading">Previous live broadcasts</h2>
          </div>
          <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noreferrer">View YouTube channel ↗</a>
        </header>
        <div className="home-video-grid">
          {videos.slice(0, 4).map((video, index) => (
            <VideoCard featured={index === 0} key={video.id} video={video} />
          ))}
        </div>
        <Link className="section-link" href="/archive">Open complete archive <span>↗</span></Link>
      </section>

      <section className="home-upcoming" aria-labelledby="upcoming-heading">
        <header>
          <p>Transmission schedule</p>
          <h2 id="upcoming-heading">Coming up</h2>
          <Link href="/schedule">View complete schedule ↗</Link>
        </header>
        <div className="upcoming-list">
          {schedule.map((show, index) => (
            <article key={show.startsAt}>
              <span>0{index + 1}</span>
              <time>{show.date}</time>
              <time>{show.time}</time>
              <h3>{show.artist}</h3>
              <b>{show.status}</b>
            </article>
          ))}
        </div>
      </section>

      <section className="home-system" aria-labelledby="system-heading">
        <div className="system-manifesto">
          <div>
            <p className="section-kicker">Independent community radio</p>
            <h2 id="system-heading">A connection<br />can unite.</h2>
            <p>
              An operating system for independent culture. Broadcasting the pulse
              of Limburg through electronic music, residents and guest signals.
            </p>
            <Link href="/about">System overview ↗</Link>
          </div>
        </div>
      </section>

      <SiteFooter />
      <MobileLiveDock />
    </main>
  );
}
