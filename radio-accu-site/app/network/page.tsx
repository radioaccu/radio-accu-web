import Image from "next/image";
import Link from "next/link";

const residents = [
  ["NODE-001", "Vincent Neumann", "Electronic / Techno", "crop-a"],
  ["NODE-002", "Bashti", "Bass / Leftfield", "crop-b"],
  ["NODE-003", "Aura", "House / Electro", "crop-c"],
  ["NODE-004", "Sohirab", "Techno / Experimental", "crop-d"],
];

function PixelMark() {
  return (
    <span className="pixel-mark" aria-hidden="true">
      {Array.from({ length: 9 }, (_, index) => <i key={index} />)}
    </span>
  );
}

export default function NetworkPage() {
  return (
    <main className="network-page">
      <header className="network-page-header">
        <Link href="/" aria-label="Back to ACCU transmission">
          <Image
            src="/accu-chrome-logo-trimmed.png"
            alt="ACCU"
            width={3953}
            height={1533}
            priority
          />
        </Link>
        <div>
          <span>System module 04</span>
          <strong>Network / Residents</strong>
        </div>
        <Link className="network-back-link" href="/">← Back to transmission</Link>
      </header>

      <section className="network-page-intro">
        <div>
          <p>Resident network</p>
          <h1>Connected<br />nodes</h1>
        </div>
        <div className="network-page-status">
          <span>Network status</span>
          <strong>04 profiles online</strong>
          <div aria-hidden="true">████████░░</div>
          <p>
            ACCU residents are the recurring voices shaping the station&apos;s
            sound, archive and community.
          </p>
        </div>
      </section>

      <section className="network-page-grid" aria-label="ACCU residents">
        {residents.map(([code, name, genre, crop]) => (
          <article className="network-resident-card" key={code}>
            <div className={`network-resident-image ${crop}`}>
              <span>{code}</span>
              <PixelMark />
            </div>
            <div className="network-resident-info">
              <div>
                <span>Resident</span>
                <h2>{name}</h2>
              </div>
              <div>
                <span>Signal range</span>
                <p>{genre}</p>
              </div>
              <b aria-hidden="true">↗</b>
            </div>
          </article>
        ))}
      </section>

      <section className="network-page-connect">
        <p>Network expanding</p>
        <h2>More resident profiles are connecting to the grid.</h2>
        <a href="mailto:info@radioaccu.com">Connect with ACCU →</a>
      </section>

      <footer className="network-page-footer">
        <strong>ACCU</strong>
        <span>A connection can unite.</span>
        <small>© 2026 ACCU — Limburg</small>
      </footer>
    </main>
  );
}
