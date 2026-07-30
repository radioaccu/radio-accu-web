import Image from "next/image";

const MIXCLOUD_LIVE_URL = "https://www.mixcloud.com/live/radioaccu";

const navigation = [
  ["01", "Transmission", "#transmission"],
  ["02", "Grid", "#grid"],
  ["03", "Archive", "#archive"],
  ["04", "Network", "#network"],
  ["05", "GM Series", "#gm-series"],
  ["06", "About", "#about"],
];

const schedule = [
  ["14:00 — 16:00", "Vincent Neumann", "Now"],
  ["16:00 — 18:00", "Bashti", "Next"],
  ["18:00 — 20:00", "Sohirab", "Later"],
  ["20:00 — 22:00", "Aura B2B Isha", "Later"],
  ["22:00 — 00:00", "Chlär", "Later"],
  ["00:00 — 02:00", "TBA", "Later"],
];

const archive = [
  ["ARC-023", "Vincent Neumann", "58 min", "crop-a"],
  ["ARC-022", "Bashti", "1:02:14", "crop-b"],
  ["ARC-021", "Sohirab", "59:33", "crop-c"],
  ["ARC-020", "Aura B2B Isha", "1:00:21", "crop-d"],
  ["ARC-019", "Chlär", "57:08", "crop-e"],
];

const guestMixes = [
  ["GM-013", "Joanna OJ", "60 min"],
  ["GM-012", "Ecilo", "61 min"],
  ["GM-011", "Skele Tale", "50 min"],
];

const residents = [
  ["NODE-001", "Vincent Neumann"],
  ["NODE-002", "Bashti"],
  ["NODE-003", "Aura"],
  ["NODE-004", "Sohirab"],
];

function PixelMark({ className = "" }: { className?: string }) {
  return (
    <span className={`pixel-mark ${className}`} aria-hidden="true">
      {Array.from({ length: 9 }, (_, index) => <i key={index} />)}
    </span>
  );
}

function ChargeBar() {
  return (
    <span className="charge-bar" aria-label="Grid charge 78 percent">
      {Array.from({ length: 14 }, (_, index) => (
        <i className={index < 11 ? "charged" : ""} key={index} />
      ))}
    </span>
  );
}

export default function Home() {
  return (
    <main className="os-frame">
      <header className="mobile-header">
        <a className="mobile-brand" href="#transmission" aria-label="ACCU home">
          <Image
            className="mobile-chrome-logo"
            src="/accu-chrome-logo-trimmed.png"
            alt="ACCU"
            width={3953}
            height={1533}
            priority
          />
        </a>
        <a className="mobile-status" href={MIXCLOUD_LIVE_URL} target="_blank" rel="noreferrer">
          <i />
          <span>Live signal</span>
        </a>
        <button type="button" aria-label="Open menu">☰</button>
      </header>

      <aside className="identity-panel">
        <div className="brand-line">
          <Image
            className="chrome-wordmark"
            src="/accu-chrome-logo-trimmed.png"
            alt="ACCU"
            width={3953}
            height={1533}
            priority
          />
        </div>

        <div className="identity-copy">
          <p>A connection can unite.</p>
          <p>Independent community radio.<br />An operating system for independent culture.</p>
        </div>

        <div className="sidebar-module grid-status">
          <p className="label">Grid status</p>
          <ChargeBar />
          <strong>Connected</strong>
        </div>

        <div className="sidebar-module diagnostics">
          <div>
            <span>Node</span>
            <strong>004</strong>
          </div>
          <div>
            <span>Latency</span>
            <strong>21 ms</strong>
          </div>
          <div className="diagnostic-output">
            <span>Output</span>
            <strong>Mixcloud Live</strong>
          </div>
        </div>

        <div className="sidebar-module frequency">
          <span>Frequency</span>
          <strong>Online 24/7</strong>
          <span className="frequency-line" aria-hidden="true" />
        </div>
      </aside>

      <div className="workspace">
        <header className="top-status">
          <div className="top-spacer" />
          <div><span>Node</span><strong>004</strong></div>
          <div><span>Latency</span><strong>21 ms</strong></div>
          <div><span>Output</span><strong>Mixcloud Live</strong></div>
          <div><span>Time</span><strong>14:27:09 CET</strong></div>
          <button className="menu-button" type="button" aria-label="Open menu">
            <span>Menu</span><b>☰</b>
          </button>
        </header>

        <nav className="main-nav" aria-label="Main navigation">
          {navigation.map(([number, label, href], index) => (
            <a className={index === 0 ? "active" : ""} href={href} key={number}>
              <small>[{number}]</small>
              <strong>{label}</strong>
            </a>
          ))}
        </nav>

        <section className="transmission-zone" id="transmission">
          <div className="on-air-panel">
            <p className="label">Now on air</p>
            <strong className="tx-code">TX-084</strong>
            <h1>Vincent Neumann</h1>
            <time>14:00 — 16:00 CET</time>
            <a className="live-button" href={MIXCLOUD_LIVE_URL} target="_blank" rel="noreferrer">
              Watch & listen live <span aria-hidden="true">◉</span>
            </a>
            <a className="secondary-button" href={MIXCLOUD_LIVE_URL} target="_blank" rel="noreferrer">
              View on Mixcloud <span aria-hidden="true">↗</span>
            </a>
            <p className="studio-status"><i /> Live from ACCU studio</p>
          </div>

          <div className="hero-image">
            <Image
              src="/accu-industrial-hero.png"
              alt="Industrial architecture in Limburg"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 38vw"
            />
            <div className="hero-image-meta">
              <div><span>Next</span><strong>Bashti</strong><time>16:00 — 18:00</time></div>
              <div><span>Later</span><strong>Sohirab</strong><time>18:00 — 20:00</time></div>
            </div>
          </div>

          <div className="schedule-panel" id="grid">
            <header>
              <div className="schedule-title">
                <span>Today&apos;s programme</span>
                <strong>Sunday transmission grid</strong>
              </div>
              <div className="schedule-meta">
                <span>06 transmissions</span>
                <a href="#grid">View full grid ↗</a>
              </div>
            </header>
            <div className="schedule-list">
              {schedule.map(([time, artist, status]) => (
                <div className={status === "Now" ? "schedule-row current" : "schedule-row"} key={time}>
                  <time>{time}</time>
                  <strong>{artist}</strong>
                  <span>{status}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="signal-history module-box" id="archive">
        <header className="module-heading">
          <h2>Signal history <span>[ Video archive — YouTube ]</span></h2>
          <a href="#archive">↗</a>
        </header>
        <div className="archive-cards">
          {archive.map(([code, artist, duration, crop]) => (
            <article className="archive-card" key={code}>
              <div className={`archive-image ${crop}`}>
                <span>{code}</span>
              </div>
              <div>
                <strong>{artist}</strong>
                <p>{duration}</p>
                <button type="button" aria-label={`Play ${artist}`}>▷</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="latest-gm module-box" id="gm-series">
        <header className="module-heading">
          <h2>Latest GM <span>[ View all ]</span></h2>
        </header>
        <div className="gm-content">
          <article className="featured-gm">
            <strong>GM-014</strong>
            <div className="gm-image crop-b" />
            <footer><span>Philou Louzolo</span><span>60 min · Belgium</span><b>▷</b></footer>
          </article>
          <div className="gm-list">
            {guestMixes.map(([code, artist, duration]) => (
              <a href="#gm-series" key={code}>
                <span><strong>{code}</strong>{artist}<small>{duration}</small></span>
                <b>↘</b>
              </a>
            ))}
            <a className="all-gm" href="#gm-series">View GM series <b>↗</b></a>
          </div>
        </div>
      </section>

      <section className="network module-box" id="network">
        <header className="module-heading"><h2>Network <span>[ View all ]</span></h2></header>
        <div className="resident-grid">
          {residents.map(([code, name]) => (
            <article key={code}>
              <strong>{code}</strong>
              <PixelMark />
              <p>{name}</p>
              <small>Resident</small>
            </article>
          ))}
          <article className="node-count">
            <strong>08</strong>
            <p>Active<br />nodes</p>
            <span className="mini-eq" aria-hidden="true">▂▄▆█▆▄▂</span>
          </article>
        </div>
      </section>

      <section className="activations module-box">
        <header className="module-heading"><h2>Activations <span>[ View all ]</span></h2></header>
        <div className="activation-list">
          <a href="#"><time>24.05.25</time><span>ACCU × Hazelt<small>Industrial day & night</small></span><b>↗</b></a>
          <a href="#"><time>07.06.25</time><span>Open call<small>Visuals & photography</small></span><b>↗</b></a>
          <a href="#"><time>21.06.25</time><span>ACCU outdoor<small>Secret location</small></span><b>↗</b></a>
        </div>
      </section>

      <section className="connection-portal module-box">
        <header className="module-heading"><h2>Connection portal</h2></header>
        <div className="portal-content">
          <div>
            <h3>Want to connect<br />with ACCU?</h3>
            <p>Submit your show, project or collaboration proposal.</p>
            <a href="mailto:info@radioaccu.com">Submit →</a>
          </div>
          <span className="wire-globe" aria-hidden="true" />
        </div>
      </section>

      <section className="system-overview module-box" id="about">
        <header className="module-heading"><h2>System overview</h2></header>
        <div className="overview-list">
          <a href="#about"><span>About ACCU</span><small>Read more</small><b>→</b></a>
          <a href="#about"><span>Partners</span><small>View all</small><b>→</b></a>
          <a href="#about"><span>FAQ</span><small>View all</small><b>→</b></a>
          <a href="mailto:info@radioaccu.com"><span>Contact</span><small>Get in touch</small><b>→</b></a>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-brand"><strong>ACCU</strong><PixelMark /></div>
        <p>A connection can unite.</p>
        <nav aria-label="Social media">
          <a href="#" aria-label="Instagram">◎</a>
          <a href="#" aria-label="YouTube">▶</a>
          <a href="#" aria-label="SoundCloud">▰</a>
          <a href={MIXCLOUD_LIVE_URL}>M—XC</a>
        </nav>
        <small>© 2026 ACCU<br />All rights reserved</small>
        <span className="footer-orbit" aria-hidden="true" />
      </footer>

      <a
        className="mobile-live-dock"
        href={MIXCLOUD_LIVE_URL}
        target="_blank"
        rel="noreferrer"
      >
        <span className="dock-status"><i /> Live now</span>
        <strong>Watch & listen</strong>
        <span aria-hidden="true">↗</span>
      </a>
    </main>
  );
}
