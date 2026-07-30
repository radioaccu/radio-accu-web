import Image from "next/image";
import Link from "next/link";
import { MIXCLOUD_LIVE_URL, navigation } from "../_data/site";

export type NavigationKey = (typeof navigation)[number]["key"];

export function PixelMark({ className = "" }: { className?: string }) {
  return (
    <span className={`pixel-mark ${className}`} aria-hidden="true">
      {Array.from({ length: 9 }, (_, index) => <i key={index} />)}
    </span>
  );
}

export function ChargeBar() {
  return (
    <span className="charge-bar" aria-label="Grid charge 78 percent">
      {Array.from({ length: 14 }, (_, index) => (
        <i className={index < 11 ? "charged" : ""} key={index} />
      ))}
    </span>
  );
}

export function SiteHeader({ active }: { active: NavigationKey }) {
  return (
    <>
      <header className="site-header">
        <Link className="site-logo" href="/" aria-label="ACCU home">
          <Image
            src="/accu-chrome-logo-trimmed.png"
            alt="ACCU"
            width={3953}
            height={1533}
            priority
          />
        </Link>

        <div className="site-readouts" aria-label="System status">
          <div><span>Node</span><strong>004</strong></div>
          <div><span>Latency</span><strong>21 ms</strong></div>
          <div><span>Output</span><strong>Mixcloud Live</strong></div>
          <div><span>Status</span><strong>Grid online</strong></div>
        </div>

        <a className="header-live" href={MIXCLOUD_LIVE_URL} target="_blank" rel="noreferrer">
          <i /> Live
        </a>
      </header>

      <nav className="site-nav" aria-label="Main navigation">
        {navigation.map((item) => (
          <Link className={item.key === active ? "active" : ""} href={item.href} key={item.key}>
            <small>[{item.number}]</small>
            <strong>{item.label}</strong>
          </Link>
        ))}
      </nav>
    </>
  );
}

export function SignalTicker() {
  return (
    <section className="signal-strip" aria-label="Now playing and coming up">
      <a className="signal-strip-play" href={MIXCLOUD_LIVE_URL} target="_blank" rel="noreferrer">
        <span aria-hidden="true">▶</span>
        <span className="sr-only">Watch and listen live</span>
      </a>
      <div className="signal-strip-window">
        <div className="signal-strip-track">
          {[0, 1].map((copy) => (
            <div className="signal-strip-group" aria-hidden={copy === 1} key={copy}>
              <span><b>Now transmitting:</b> TX-084 — Vincent Neumann — 14:00–16:00 CET</span>
              <span><b>Up next:</b> Bashti — 16:00–18:00 CET</span>
            </div>
          ))}
        </div>
      </div>
      <Link className="signal-strip-schedule" href="/grid">Grid ↗</Link>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-brand"><strong>ACCU</strong><PixelMark /></div>
      <p>A connection can unite.</p>
      <nav aria-label="Social media">
        <a href="https://www.instagram.com/radioaccu" target="_blank" rel="noreferrer">Instagram</a>
        <a href="https://www.youtube.com/@radioaccu" target="_blank" rel="noreferrer">YouTube</a>
        <a href="https://soundcloud.com/radioaccu" target="_blank" rel="noreferrer">SoundCloud</a>
      </nav>
      <small>© 2026 ACCU<br />Limburg, Belgium</small>
    </footer>
  );
}

export function MobileLiveDock() {
  return (
    <a className="mobile-live-dock" href={MIXCLOUD_LIVE_URL} target="_blank" rel="noreferrer">
      <span className="dock-status"><i /> Live now</span>
      <strong>Watch & listen</strong>
      <span aria-hidden="true">↗</span>
    </a>
  );
}

export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="page-intro">
      <div>
        <p>{eyebrow}</p>
        <h1>{title}</h1>
      </div>
      <p className="page-intro-copy">{description}</p>
    </section>
  );
}
