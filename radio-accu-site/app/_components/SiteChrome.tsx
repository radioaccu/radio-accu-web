import Image from "next/image";
import Link from "next/link";
import {
  navigation,
  schedule as fallbackSchedule,
  type ScheduleShow,
} from "../_data/site";
import { BroadcastLink } from "./BroadcastLink";

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

export function SiteHeader({ active }: { active?: NavigationKey }) {
  const visibleNavigation = navigation.filter(
    (item) => item.key !== "gm" || process.env.GM_SERIES_ENABLED === "true",
  );

  return (
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

      <nav className="site-nav" aria-label="Main navigation">
        {visibleNavigation.map((item, index) => (
          <Link className={item.key === active ? "active" : ""} href={item.href} key={item.key}>
            <small>[{String(index + 1).padStart(2, "0")}]</small>
            <strong>{item.label}</strong>
          </Link>
        ))}
      </nav>

      <BroadcastLink className="header-live">
        <i />
        <span className="when-live">Live</span>
        <span className="when-archive">Listen</span>
      </BroadcastLink>
    </header>
  );
}

export function SignalTicker({ shows = fallbackSchedule }: { shows?: readonly ScheduleShow[] }) {
  const nextShow = shows[0];
  const followingShow = shows[1];
  const firstMessage = nextShow
    ? `${nextShow.date} — ${nextShow.artist} — ${nextShow.time} CET`
    : "New transmission dates are being connected";
  const secondMessage = followingShow
    ? `${followingShow.artist} follows at ${followingShow.time.split(" — ")[0]} CET`
    : "Click play for a previous audio broadcast";

  return (
    <section className="signal-strip" aria-label="Now playing and coming up">
      <BroadcastLink className="signal-strip-play">
        <span aria-hidden="true">▶</span>
        <span className="sr-only">Watch and listen live</span>
      </BroadcastLink>
      <div className="signal-strip-window">
        <div className="signal-strip-track">
          {[0, 1].map((copy) => (
            <div className="signal-strip-group" aria-hidden={copy === 1} key={copy}>
              <span><b>Next transmission:</b> {firstMessage}</span>
              <span><b>Following signal:</b> {secondMessage}</span>
            </div>
          ))}
        </div>
      </div>
      <Link className="signal-strip-schedule" href="/schedule">Schedule ↗</Link>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <Image
          className="footer-symbol"
          src="/accu-symbol-white.png"
          alt="ACCU symbol"
          width={3000}
          height={3000}
        />
      </div>
      <div className="footer-statement">
        <span>Radio ACCU</span>
        <p>A connection can unite.</p>
        <Link href="/submit">Submit a show ↗</Link>
      </div>
      <nav className="footer-socials" aria-label="Social media and audio platforms">
        <span>Follow / listen</span>
        <div>
          <a href="https://www.instagram.com/radioaccu" target="_blank" rel="noreferrer">Instagram ↗</a>
          <a href="https://soundcloud.com/radioaccu" target="_blank" rel="noreferrer">SoundCloud ↗</a>
          <a href="https://www.youtube.com/@radioaccu" target="_blank" rel="noreferrer">YouTube ↗</a>
          <a href="https://www.mixcloud.com/radioaccu/" target="_blank" rel="noreferrer">Mixcloud ↗</a>
        </div>
      </nav>
      <address className="footer-address">
        <span>Broadcast address</span>
        <strong>Bootstraat 9</strong>
        <small>3500 Hasselt, Belgium</small>
        <a href="mailto:info@radioaccu.com">info@radioaccu.com ↗</a>
        <small>© 2026 ACCU</small>
      </address>
    </footer>
  );
}

export function MobileLiveDock() {
  return (
    <BroadcastLink className="mobile-live-dock">
      <span className="dock-status">
        <i />
        <span className="when-live">Live now</span>
        <span className="when-archive">Archive audio</span>
      </span>
      <strong>
        <span className="when-live">Watch & listen</span>
        <span className="when-archive">Listen now</span>
      </strong>
      <span aria-hidden="true">↗</span>
    </BroadcastLink>
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

export function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <section className="simple-page-title">
      <h1>{children}</h1>
    </section>
  );
}
