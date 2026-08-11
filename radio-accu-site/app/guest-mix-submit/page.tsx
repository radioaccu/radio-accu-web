import type { Metadata } from "next";
import { GuestMixSubmissionForm } from "../_components/GuestMixSubmissionForm";
import { PageTitle, SiteFooter, SiteHeader } from "../_components/SiteChrome";

export const metadata: Metadata = {
  title: "Guest Mix submission — Radio ACCU",
  description: "Private submission portal for invited Radio ACCU Guest Mix artists.",
  robots: { index: false, follow: false },
};

type GuestMixSubmitPageProps = {
  searchParams: Promise<{ invite?: string | string[] }>;
};

export default async function GuestMixSubmitPage({ searchParams }: GuestMixSubmitPageProps) {
  const parameters = await searchParams;
  const inviteToken = Array.isArray(parameters.invite) ? parameters.invite[0] : parameters.invite;

  return (
    <main className="site-shell">
      <SiteHeader />
      <PageTitle>Guest Mix submission</PageTitle>

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

      <GuestMixSubmissionForm inviteToken={inviteToken?.trim().slice(0, 200)} />
      <SiteFooter />
    </main>
  );
}
