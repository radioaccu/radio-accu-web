"use client";

import { useState, type FormEvent } from "react";

type SubmitState = "idle" | "sending" | "success" | "error";

export function GuestMixSubmissionForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());

    setState("sending");
    setMessage("");

    try {
      const response = await fetch("/api/guest-mix-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          exclusive: values.exclusive === "Yes",
          rightsConfirmed: values.rightsConfirmed === "on",
          publicationPermission: values.publicationPermission === "on",
          archivePermission: values.archivePermission === "on",
          privacyConsent: values.privacyConsent === "on",
        }),
      });
      const result = await response.json() as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "The submission could not be sent.");
      }

      form.reset();
      setState("success");
      setMessage("Your Guest Mix submission has been received. Radio ACCU will confirm the release date by e-mail.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "The submission could not be sent.");
    }
  }

  return (
    <form className="show-application-form" onSubmit={handleSubmit}>
      <div className="form-section-heading">
        <span>01</span>
        <div>
          <p>Private submission</p>
          <h2>Artist information</h2>
        </div>
      </div>

      <div className="form-grid">
        <label>
          <span>Artist / DJ name *</span>
          <input name="artistName" required maxLength={120} autoComplete="organization" />
        </label>
        <label>
          <span>E-mail address *</span>
          <input name="email" required type="email" maxLength={180} autoComplete="email" />
        </label>
        <label>
          <span>Country *</span>
          <input name="country" required maxLength={100} autoComplete="country-name" />
        </label>
        <label>
          <span>Instagram *</span>
          <input name="instagram" required maxLength={300} placeholder="https://instagram.com/…" />
        </label>
        <label>
          <span>SoundCloud *</span>
          <input name="soundcloud" required type="url" maxLength={500} placeholder="https://soundcloud.com/…" />
        </label>
        <label>
          <span>Spotify artist page</span>
          <input name="spotify" type="url" maxLength={500} />
        </label>
        <label>
          <span>Mixcloud</span>
          <input name="mixcloud" type="url" maxLength={500} />
        </label>
        <label>
          <span>Website</span>
          <input name="artistWebsite" type="url" maxLength={500} />
        </label>
      </div>

      <div className="form-section-heading">
        <span>02</span>
        <div>
          <p>Audio submission</p>
          <h2>Your Guest Mix</h2>
        </div>
      </div>

      <div className="form-grid">
        <label>
          <span>Guest Mix title *</span>
          <input name="guestMixTitle" required maxLength={180} placeholder="Radio ACCU Guest Mix | Artist Name" />
        </label>
        <label>
          <span>Mix length *</span>
          <input name="mixLength" required readOnly value="60 minutes" />
        </label>
        <label>
          <span>Audio format *</span>
          <select name="audioFormat" required defaultValue="">
            <option value="" disabled>Select a format</option>
            <option>WAV</option>
            <option>AIFF</option>
            <option>320 kbps MP3</option>
          </select>
        </label>
        <label>
          <span>Exclusive to Radio ACCU? *</span>
          <select name="exclusive" required defaultValue="">
            <option value="" disabled>Select an answer</option>
            <option>Yes</option>
            <option>No</option>
          </select>
        </label>
        <label className="form-span-2">
          <span>Mix download link *</span>
          <input name="downloadLink" required type="url" maxLength={1000} placeholder="Dropbox, WeTransfer, Google Drive…" />
          <small>Use a link that remains available long enough for the ACCU team to download the file.</small>
        </label>
        <label className="form-span-2">
          <span>Tracklist</span>
          <textarea name="tracklist" maxLength={8000} rows={10} placeholder="01. Artist — Track&#10;02. Artist — Track" />
        </label>
      </div>

      <div className="form-section-heading">
        <span>03</span>
        <div>
          <p>Profile and promotion</p>
          <h2>Tell us about your work</h2>
        </div>
      </div>

      <div className="form-grid">
        <label className="form-span-2">
          <span>Biography — 100 to 250 words *</span>
          <textarea name="biography" required minLength={300} maxLength={2400} rows={10} />
        </label>
        <label>
          <span>Record labels</span>
          <textarea name="recordLabels" maxLength={1000} rows={4} />
        </label>
        <label>
          <span>Recent or upcoming releases</span>
          <textarea name="releases" maxLength={1600} rows={4} />
        </label>
        <label className="form-span-2">
          <span>Anything to mention in the promotion?</span>
          <textarea name="promotionNotes" maxLength={1600} rows={5} />
        </label>
      </div>

      <div className="form-section-heading">
        <span>04</span>
        <div>
          <p>Press and promotional assets</p>
          <h2>Share your files</h2>
        </div>
      </div>

      <div className="form-grid">
        <label>
          <span>High-resolution press photo link *</span>
          <input name="pressPhotoLink" required type="url" maxLength={1000} />
        </label>
        <label>
          <span>Electronic Press Kit link</span>
          <input name="epkLink" type="url" maxLength={1000} />
        </label>
        <label>
          <span>Artist logo link</span>
          <input name="artistLogoLink" type="url" maxLength={1000} />
        </label>
        <label>
          <span>Current promotional artwork link</span>
          <input name="promoArtworkLink" type="url" maxLength={1000} />
        </label>
        <label className="form-span-2">
          <span>Station Voice ID link</span>
          <input name="voiceIdLink" type="url" maxLength={1000} />
          <small>Optional: “Hi, this is [Artist Name], and you’re listening to my exclusive Radio ACCU Guest Mix.”</small>
        </label>
      </div>

      <div className="form-section-heading">
        <span>05</span>
        <div>
          <p>Scheduling</p>
          <h2>Release preferences</h2>
        </div>
      </div>

      <div className="form-grid">
        <label>
          <span>Preferred release period</span>
          <textarea name="preferredReleasePeriod" maxLength={700} rows={4} />
        </label>
        <label>
          <span>Dates to avoid</span>
          <textarea name="datesToAvoid" maxLength={700} rows={4} />
        </label>
      </div>

      <div className="form-section-heading">
        <span>06</span>
        <div>
          <p>Permissions</p>
          <h2>Confirm your submission</h2>
        </div>
      </div>

      <label className="form-consent">
        <input name="rightsConfirmed" type="checkbox" required />
        <span>I confirm that I own, or have the necessary rights to distribute, this recording. *</span>
      </label>
      <label className="form-consent">
        <input name="publicationPermission" type="checkbox" required />
        <span>I grant Radio ACCU permission to publish, stream, archive and promote this Guest Mix across its website, YouTube, SoundCloud, Mixcloud and social channels. *</span>
      </label>
      <label className="form-consent">
        <input name="archivePermission" type="checkbox" required />
        <span>I understand that the Guest Mix may remain available in the Radio ACCU archive unless otherwise agreed. *</span>
      </label>
      <label className="form-consent">
        <input name="privacyConsent" type="checkbox" required />
        <span>I agree that Radio ACCU may store these details to prepare, publish and contact me about this Guest Mix. *</span>
      </label>

      <label className="form-honeypot" aria-hidden="true">
        <span>Company</span>
        <input name="company" tabIndex={-1} autoComplete="off" />
      </label>

      <div className="form-submit-row">
        <button disabled={state === "sending" || state === "success"} type="submit">
          {state === "sending" ? "Connecting…" : state === "success" ? "Submission received" : "Submit Guest Mix"}
          <span aria-hidden="true">↗</span>
        </button>
        <p className={`form-response ${state}`} aria-live="polite">
          {message}
        </p>
      </div>
    </form>
  );
}
