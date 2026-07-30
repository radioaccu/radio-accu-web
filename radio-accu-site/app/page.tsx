import Image from "next/image";
import Link from "next/link";
import {
  ChargeBar,
  MobileLiveDock,
  SignalTicker,
  SiteFooter,
  SiteHeader,
} from "./_components/SiteChrome";
import { VideoCard } from "./_components/VideoCard";
import { MIXCLOUD_LIVE_URL, schedule, videos, YOUTUBE_CHANNEL_URL } from "./_data/site";

export default function Home() {
  return (
    <main className="site-shell">
      <SiteHeader active="home" />
      <SignalTicker />

      <section className="home-live" aria-labelledby="live-title">
        <a className="home-live-visual" href={MIXCLOUD_LIVE_URL} target="_blank" rel="noreferrer">
          <Image
            src="/accu-industrial-hero.png"
            alt="Industrial architecture in Limburg — open the Radio ACCU livestream"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 72vw"
          />
          <div className="live-visual-shade" />
          <span className="live-visual-status"><i /> Mixcloud live</span>
          <span className="live-visual-play" aria-hidden="true">▶</span>
          <span className="live-visual-action">Enter live transmission ↗</span>
        </a>

        <div className="home-live-info">
          <p className="section-kicker">Now on air / TX-084</p>
          <h1 id="live-title">Vincent<br />Neumann</h1>
          <time>14:00 — 16:00 CET</time>
          <a className="primary-action" href={MIXCLOUD_LIVE_URL} target="_blank" rel="noreferrer">
            Watch & listen live <span aria-hidden="true">◉</span>
          </a>
          <div className="next-signal">
            <span>Up next</span>
            <strong>Bashti</strong>
            <time>16:00 — 18:00</time>
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
          <p>Transmission grid</p>
          <h2 id="upcoming-heading">Coming up today</h2>
          <Link href="/grid">View complete grid ↗</Link>
        </header>
        <div className="upcoming-list">
          {schedule.slice(1, 4).map((show, index) => (
            <article key={show.time}>
              <span>0{index + 1}</span>
              <time>{show.time}</time>
              <h3>{show.artist}</h3>
              <b>{show.status}</b>
            </article>
          ))}
        </div>
      </section>

      <section className="home-system" aria-labelledby="system-heading">
        <div className="system-manifesto">
          <Image
            src="/accu-chrome-logo-trimmed.png"
            alt="ACCU"
            width={3953}
            height={1533}
          />
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

        <div className="system-diagnostics">
          <div>
            <span>Grid status</span>
            <ChargeBar />
            <strong>Connected</strong>
          </div>
          <dl>
            <div><dt>Node</dt><dd>004</dd></div>
            <div><dt>Latency</dt><dd>21 ms</dd></div>
            <div><dt>Output</dt><dd>Mixcloud Live</dd></div>
            <div><dt>Frequency</dt><dd>Online 24/7</dd></div>
          </dl>
        </div>
      </section>

      <SiteFooter />
      <MobileLiveDock />
    </main>
  );
}
