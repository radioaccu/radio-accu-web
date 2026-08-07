import type { Metadata } from "next";
import { PageTitle, SiteFooter, SiteHeader } from "../_components/SiteChrome";
import { ShowApplicationForm } from "../_components/ShowApplicationForm";

export const metadata: Metadata = {
  title: "Submit a show — Radio ACCU",
  description: "Propose a radio show, DJ set, live performance or multidisciplinary project to Radio ACCU.",
};

export default function SubmitPage() {
  return (
    <main className="site-shell">
      <SiteHeader />
      <PageTitle>Submit a show</PageTitle>

      <section className="submit-introduction">
        <p>Connection portal</p>
        <div>
          <h2>Bring your signal to ACCU.</h2>
          <p>
            Propose a DJ set, live performance, radio concept, conversation or
            multidisciplinary project. Tell us clearly what you want to create;
            every completed application is delivered directly to
            info@radioaccu.com.
          </p>
          <p>
            Submitting a proposal does not guarantee a booking. The ACCU team
            reviews every idea and contacts selected applicants by e-mail.
          </p>
        </div>
      </section>

      <ShowApplicationForm />
      <SiteFooter />
    </main>
  );
}
