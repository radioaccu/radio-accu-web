import Image from "next/image";

const MIXCLOUD_LIVE_URL = "https://www.mixcloud.com/live/radioaccu";

const upcoming = [
  { code: "TX-026", date: "02 AUG", time: "14:00", artist: "ACCU Radio Show" },
  { code: "TX-027", date: "09 AUG", time: "14:00", artist: "Sunday Transmission" },
  { code: "TX-028", date: "16 AUG", time: "14:00", artist: "Resident Session" },
  { code: "TX-029", date: "23 AUG", time: "14:00", artist: "Guest Operator" },
  { code: "TX-030", date: "30 AUG", time: "14:00", artist: "Closing Current" },
];

const archive = [
  { code: "ARC-023", title: "Sunday Transmission", meta: "Video · 118 min" },
  { code: "ARC-022", title: "Limburg Frequency", meta: "Video · 94 min" },
  { code: "ARC-021", title: "Resident Output", meta: "Video · 121 min" },
];

const guestMixes = [
  { code: "GM-001", artist: "Incoming Signal", meta: "60 min · Belgium" },
  { code: "GM-002", artist: "Incoming Signal", meta: "60 min · Europe" },
  { code: "GM-003", artist: "Incoming Signal", meta: "60 min · Worldwide" },
];

const network = [
  { code: "NODE-001", role: "Resident", status: "Active" },
  { code: "NODE-002", role: "Resident", status: "Active" },
  { code: "NODE-003", role: "Collaborator", status: "Connected" },
  { code: "NODE-004", role: "Visual Operator", status: "Connected" },
];

function PixelBars({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "pixel-bars compact" : "pixel-bars"} aria-hidden="true">
      {Array.from({ length: compact ? 8 : 12 }, (_, index) => (
        <i key={index} />
      ))}
    </span>
  );
}

export default function Home() {
  return (
    <main id="top">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="ACCU home">
          <Image src="/accu-chrome-logo.png" alt="ACCU" width={152} height={76} priority />
        </a>

        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#live">Live</a>
          <a href="#upcoming">Grid</a>
          <a href="#archive">Archive</a>
          <a href="#gm-series">GM Series</a>
          <a href="#network">Network</a>
          <a href="#about">About</a>
        </nav>

        <a className="header-cta" href="mailto:info@radioaccu.com">
          Connect <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className="system-bar" aria-label="Grid status">
        <div>
          <span className="status-light" aria-hidden="true" />
          <span>Grid online</span>
        </div>
        <PixelBars />
        <div className="system-copy">
          <span>Connected</span>
          <span>Hasselt / BE</span>
          <span>Node 001</span>
        </div>
      </section>

      <section className="live-section" id="live">
        <div className="live-copy">
          <p className="module-label">01 / Live transmission</p>
          <div>
            <p className="eyebrow">Current output / Mixcloud Pro</p>
            <h1>
              Sunday
              <br />
              Transmission
            </h1>
          </div>

          <div className="live-meta">
            <p>
              <span>Operator</span>
              ACCU Radio Show
            </p>
            <p>
              <span>Window</span>
              Sunday · 14:00—18:00 CET
            </p>
            <p>
              <span>Origin</span>
              Limburg, Belgium
            </p>
          </div>

          <a
            className="primary-action"
            href={MIXCLOUD_LIVE_URL}
            target="_blank"
            rel="noreferrer"
          >
            <span className="play-glyph" aria-hidden="true">▶</span>
            Watch on Mixcloud Live
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="live-visual" aria-label="Temporary live transmission visual">
          <div className="visual-grid" aria-hidden="true" />
          <div className="signal-orbit" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <Image
            src="/accu-symbol-white.png"
            alt=""
            className="visual-symbol"
            width={500}
            height={500}
            priority
          />
          <div className="visual-readout">
            <span>Signal stable</span>
            <strong>98%</strong>
          </div>
          <p className="visual-note">Image source pending / architecture + environment</p>
        </div>
      </section>

      <section className="section upcoming-section" id="upcoming">
        <header className="section-title">
          <p className="module-label">02 / Transmission grid</p>
          <h2>Upcoming</h2>
          <p className="section-note">The next five confirmed signals.</p>
        </header>

        <div className="upcoming-list">
          {upcoming.map((show, index) => (
            <article className="upcoming-row" key={show.code}>
              <span className="row-index">{String(index + 1).padStart(2, "0")}</span>
              <time>
                <strong>{show.date}</strong>
                <span>{show.time} CET</span>
              </time>
              <h3>{show.artist}</h3>
              <span className="code">{show.code}</span>
              <span className="row-arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section archive-section" id="archive">
        <header className="section-title inline-title">
          <div>
            <p className="module-label">03 / Signal history</p>
            <h2>Video Archive</h2>
          </div>
          <a href="#archive">View full archive <span aria-hidden="true">→</span></a>
        </header>

        <div className="archive-grid">
          {archive.map((item, index) => (
            <article className="archive-card" key={item.code}>
              <div className={`media-placeholder media-${index + 1}`}>
                <span className="corner-code">{item.code}</span>
                <PixelBars compact />
                <button aria-label={`Play ${item.title}`} type="button">▶</button>
              </div>
              <div className="card-meta">
                <div>
                  <p>{item.code}</p>
                  <h3>{item.title}</h3>
                </div>
                <span>{item.meta}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section gm-section" id="gm-series">
        <header className="section-title">
          <p className="module-label">04 / Invitation-only output</p>
          <h2>GM Series</h2>
          <p className="section-note">Sixty-minute signals from invited artists and producers.</p>
        </header>

        <div className="gm-grid">
          {guestMixes.map((mix, index) => (
            <article className="gm-card" key={mix.code}>
              <div className="gm-number">
                <span>GM /</span>
                <strong>{mix.code.slice(-3)}</strong>
              </div>
              <div className={`gm-art gm-art-${index + 1}`} aria-hidden="true">
                <div className="pixel-field" />
              </div>
              <div className="gm-info">
                <h3>{mix.artist}</h3>
                <p>{mix.meta}</p>
                <span>Awaiting connection ↗</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section network-section" id="network">
        <header className="section-title network-title">
          <p className="module-label">05 / Connected operators</p>
          <h2>Network</h2>
          <div className="network-status">
            <PixelBars />
            <span>04 nodes online</span>
          </div>
        </header>

        <div className="network-grid">
          {network.map((node, index) => (
            <article className="node-card" key={node.code}>
              <span className="node-index">{String(index + 1).padStart(2, "0")}</span>
              <div className="node-portrait" aria-label="Temporary resident image">
                <span>Image pending</span>
              </div>
              <div>
                <p>{node.code}</p>
                <h3>{node.role}</h3>
              </div>
              <span className="node-status"><i /> {node.status}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section" id="about">
        <p className="module-label">06 / System overview</p>
        <div>
          <h2>A connection can unite.</h2>
          <p>
            ACCU is an independent community radio platform connecting electronic
            music, local culture and emerging voices from Limburg and beyond.
          </p>
          <a href="mailto:info@radioaccu.com">info@radioaccu.com <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <footer className="site-footer">
        <div>
          <Image src="/accu-chrome-logo.png" alt="ACCU" width={144} height={72} />
          <p>Independent community radio from Limburg, Belgium.</p>
        </div>
        <div className="footer-links">
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://soundcloud.com/" target="_blank" rel="noreferrer">SoundCloud</a>
          <a href="https://www.youtube.com/" target="_blank" rel="noreferrer">YouTube</a>
          <a href={MIXCLOUD_LIVE_URL} target="_blank" rel="noreferrer">Mixcloud</a>
        </div>
        <p className="footer-code">GRID / ACCU / 2026</p>
      </footer>
    </main>
  );
}
