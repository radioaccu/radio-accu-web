import type { Metadata } from "next";
import Image from "next/image";
import { GuestMixSubmissionForm } from "../_components/GuestMixSubmissionForm";

export const metadata: Metadata = {
  title: "Guest Mix submission — Radio ACCU",
  description: "Private submission portal for invited Radio ACCU Guest Mix artists.",
  robots: { index: false, follow: false },
};

export default function GuestMixSubmitPage() {
  return (
    <main className="gm-portal-shell">
      <header className="gm-portal-header">
        <a href="https://radioaccu.com" aria-label="Visit the Radio ACCU website">
          <Image
            src="/accu-chrome-logo-trimmed.png"
            alt="Radio ACCU"
            width={3953}
            height={1533}
            priority
          />
        </a>
        <div>
          <span>Private portal</span>
          <strong>Guest Mix Series</strong>
        </div>
        <p>Invitation only</p>
      </header>

      <section className="gm-portal-title">
        <span>ACCU / GM</span>
        <h1>Guest Mix<br />submission</h1>
      </section>

      <section className="submit-introduction">
        <p>Invitation only</p>
        <div>
          <h2>Connect your signal to Radio ACCU.</h2>
          <p>
            This private portal is reserved for artists personally invited to
            the Radio ACCU Guest Mix Series. Complete every required field and
            provide download links for the mix and promotional assets.
          </p>
          <p>
            Your information is stored privately in ACCU HQ. Nothing becomes
            public until the ACCU team reviews the submission and confirms its
            release.
          </p>
        </div>
      </section>

      <GuestMixSubmissionForm />
      <footer className="gm-portal-footer">
        <Image src="/accu-symbol-white.png" alt="ACCU symbol" width={3000} height={3000} />
        <p>A connection can unite.</p>
        <div>
          <a href="mailto:info@radioaccu.com">info@radioaccu.com</a>
          <span>Private invited-artist portal</span>
        </div>
      </footer>
    </main>
  );
}
