"use client";

import { useState, type FormEvent } from "react";

type SubmitState = "idle" | "sending" | "success" | "error";

export function ShowApplicationForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());

    setState("sending");
    setMessage("");

    try {
      const response = await fetch("/api/show-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          consent: values.consent === "on",
        }),
      });
      const result = await response.json() as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "The application could not be sent.");
      }

      form.reset();
      setState("success");
      setMessage("Your show proposal has been sent to Radio ACCU. We will reply by e-mail.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "The application could not be sent.");
    }
  }

  return (
    <form className="show-application-form" onSubmit={handleSubmit}>
      <div className="form-section-heading">
        <span>01</span>
        <div>
          <p>Contact</p>
          <h2>Who are you?</h2>
        </div>
      </div>

      <div className="form-grid">
        <label>
          <span>Artist / collective name *</span>
          <input name="artistName" required maxLength={100} autoComplete="organization" />
        </label>
        <label>
          <span>Contact name *</span>
          <input name="contactName" required maxLength={100} autoComplete="name" />
        </label>
        <label>
          <span>E-mail *</span>
          <input name="email" required type="email" maxLength={180} autoComplete="email" />
        </label>
        <label>
          <span>Phone</span>
          <input name="phone" type="tel" maxLength={50} autoComplete="tel" />
        </label>
        <label className="form-span-2">
          <span>City / country *</span>
          <input name="location" required maxLength={120} autoComplete="country-name" />
        </label>
      </div>

      <div className="form-section-heading">
        <span>02</span>
        <div>
          <p>Show proposal</p>
          <h2>What do you want to transmit?</h2>
        </div>
      </div>

      <div className="form-grid">
        <label>
          <span>Proposed show title *</span>
          <input name="showTitle" required maxLength={140} />
        </label>
        <label>
          <span>Format *</span>
          <select name="showFormat" required defaultValue="">
            <option value="" disabled>Select a format</option>
            <option>DJ set</option>
            <option>Live performance</option>
            <option>Radio show / talk</option>
            <option>Multidisciplinary performance</option>
            <option>Other</option>
          </select>
        </label>
        <label className="form-span-2">
          <span>Genres / artistic direction *</span>
          <input name="genres" required maxLength={200} />
        </label>
        <label className="form-span-2">
          <span>Describe the show *</span>
          <textarea name="description" required minLength={80} maxLength={2400} rows={8} />
          <small>Tell us about the concept, contributors and why it fits Radio ACCU.</small>
        </label>
        <label className="form-span-2">
          <span>Listening / portfolio links *</span>
          <textarea name="links" required maxLength={1200} rows={4} placeholder="SoundCloud, Mixcloud, YouTube, Instagram, website…" />
        </label>
      </div>

      <div className="form-section-heading">
        <span>03</span>
        <div>
          <p>Planning</p>
          <h2>When and what do you need?</h2>
        </div>
      </div>

      <div className="form-grid">
        <label className="form-span-2">
          <span>Preferred dates or period *</span>
          <textarea name="preferredDates" required maxLength={700} rows={3} placeholder="Mention several options when possible." />
        </label>
        <label className="form-span-2">
          <span>Technical requirements</span>
          <textarea name="technicalRequirements" maxLength={1200} rows={4} />
        </label>
        <label className="form-span-2">
          <span>Anything else?</span>
          <textarea name="additionalNotes" maxLength={1200} rows={4} />
        </label>
      </div>

      <label className="form-consent">
        <input name="consent" type="checkbox" required />
        <span>I agree that Radio ACCU may use these details to review and contact me about this show proposal. *</span>
      </label>

      <label className="form-honeypot" aria-hidden="true">
        <span>Website</span>
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <div className="form-submit-row">
        <button disabled={state === "sending"} type="submit">
          {state === "sending" ? "Sending…" : "Send show proposal"}
          <span aria-hidden="true">↗</span>
        </button>
        <p className={`form-response ${state}`} aria-live="polite">
          {message}
        </p>
      </div>
    </form>
  );
}
