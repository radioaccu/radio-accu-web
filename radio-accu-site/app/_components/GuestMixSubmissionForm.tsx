"use client";

import { useState, type FormEvent } from "react";

type SubmitState = "idle" | "sending" | "success" | "error";
type FieldErrors = Record<string, string>;

type ReleaseDateChoice = {
  date: string;
  label: string;
  month: string;
};

const MAX_RELEASE_DATES = 5;

function isHttpUrl(value: string) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function FieldError({ errors, name }: { errors: FieldErrors; name: string }) {
  const error = errors[name];
  if (!error) return null;
  return <small className="form-field-error" id={`${name}-error`} role="alert">{error}</small>;
}

function buildReleaseDateChoices() {
  const brusselsDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Brussels",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const [year, month, day] = brusselsDate.split("-").map(Number);
  const firstDate = new Date(Date.UTC(year, month - 1, day));
  const lastDate = new Date(Date.UTC(year + 1, 11, 31));
  const choices: ReleaseDateChoice[] = [];

  for (const date = new Date(firstDate); date <= lastDate; date.setUTCDate(date.getUTCDate() + 1)) {
    const weekday = date.getUTCDay();
    if (weekday === 0 || weekday === 6) continue;

    choices.push({
      date: date.toISOString().slice(0, 10),
      label: new Intl.DateTimeFormat("en-GB", {
        timeZone: "UTC",
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(date),
      month: new Intl.DateTimeFormat("en-GB", {
        timeZone: "UTC",
        month: "long",
        year: "numeric",
      }).format(date),
    });
  }

  return choices;
}

export function GuestMixSubmissionForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [releaseDateChoices] = useState<ReleaseDateChoice[]>(buildReleaseDateChoices);
  const [selectedReleaseDates, setSelectedReleaseDates] = useState<string[]>([]);

  const releaseDateGroups = releaseDateChoices.reduce<Array<{ month: string; choices: ReleaseDateChoice[] }>>(
    (groups, choice) => {
      const currentGroup = groups.at(-1);
      if (currentGroup?.month === choice.month) currentGroup.choices.push(choice);
      else groups.push({ month: choice.month, choices: [choice] });
      return groups;
    },
    [],
  );

  function toggleReleaseDate(date: string) {
    clearFieldError("preferredReleasePeriod");
    setSelectedReleaseDates((current) => {
      if (current.includes(date)) return current.filter((item) => item !== date);
      if (current.length >= MAX_RELEASE_DATES) return current;
      return [...current, date];
    });
  }

  function clearFieldError(name: string) {
    setFieldErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  function handleFieldActivity(event: FormEvent<HTMLFormElement>) {
    const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    if (target.name) clearFieldError(target.name);
  }

  function focusFirstError(form: HTMLFormElement, errors: FieldErrors) {
    const firstName = Object.keys(errors)[0];
    if (!firstName) return;
    const target = firstName === "preferredReleasePeriod"
      ? form.querySelector<HTMLElement>("[data-release-date-picker]")
      : form.querySelector<HTMLElement>(`[name="${firstName}"]`);
    requestAnimationFrame(() => {
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
      target?.focus({ preventScroll: true });
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    const value = (name: string) => String(values[name] ?? "").trim();
    const preferredReleasePeriod = releaseDateChoices
      .filter((choice) => selectedReleaseDates.includes(choice.date))
      .map((choice) => choice.label)
      .join("\n");

    const errors: FieldErrors = {};
    const requiredTextFields: Array<[string, string]> = [
      ["artistName", "Artist / DJ name is required."],
      ["email", "E-mail address is required."],
      ["instagram", "Instagram is required."],
      ["soundcloud", "SoundCloud is required."],
      ["guestMixTitle", "Guest Mix title is required."],
      ["audioFormat", "Select an audio format."],
      ["exclusive", "Select Yes or No."],
      ["downloadLink", "A mix download link is required."],
      ["biography", "Biography is required."],
      ["pressPhotoLink", "A press photo link is required."],
    ];
    requiredTextFields.forEach(([name, error]) => {
      if (!value(name)) errors[name] = error;
    });

    if (value("email") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value("email"))) {
      errors.email = "Enter a valid e-mail address.";
    }
    ["soundcloud", "downloadLink", "pressPhotoLink"].forEach((name) => {
      if (value(name) && !isHttpUrl(value(name))) errors[name] = "Enter a complete http:// or https:// link.";
    });
    ["epkLink", "artistLogoLink", "promoArtworkLink", "voiceIdLink"].forEach((name) => {
      if (value(name) && !isHttpUrl(value(name))) errors[name] = "Enter a complete http:// or https:// link, or leave this optional field empty.";
    });

    const biographyWords = value("biography").split(/\s+/).filter(Boolean).length;
    if (value("biography") && (biographyWords < 100 || biographyWords > 250)) {
      errors.biography = `Biography must contain 100–250 words (currently ${biographyWords}).`;
    }
    if (!preferredReleasePeriod) errors.preferredReleasePeriod = "Select at least one preferred release date.";
    if (values.publicationPermission !== "on") errors.publicationPermission = "This permission is required.";
    if (values.archivePermission !== "on") errors.archivePermission = "This confirmation is required.";
    if (values.privacyConsent !== "on") errors.privacyConsent = "This consent is required.";

    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      setState("error");
      setMessage("Please complete the highlighted required information.");
      focusFirstError(form, errors);
      return;
    }

    setFieldErrors({});
    setState("sending");
    setMessage("");

    try {
      const response = await fetch("/api/guest-mix-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          preferredReleasePeriod,
          exclusive: values.exclusive === "Yes",
          publicationPermission: values.publicationPermission === "on",
          archivePermission: values.archivePermission === "on",
          privacyConsent: values.privacyConsent === "on",
        }),
      });
      const result = await response.json() as { message?: string; fieldErrors?: FieldErrors };

      if (!response.ok) {
        if (result.fieldErrors && Object.keys(result.fieldErrors).length) {
          setFieldErrors(result.fieldErrors);
          setState("error");
          setMessage("Please complete the highlighted required information.");
          focusFirstError(form, result.fieldErrors);
          return;
        }
        throw new Error(result.message || "The submission could not be sent.");
      }

      form.reset();
      setSelectedReleaseDates([]);
      setState("success");
      setMessage("Your Guest Mix submission has been received. Radio ACCU will confirm the release date by e-mail.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "The submission could not be sent.");
    }
  }

  return (
    <form
      className="show-application-form"
      noValidate
      onChange={handleFieldActivity}
      onInput={handleFieldActivity}
      onSubmit={handleSubmit}
    >
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
          <input name="artistName" required maxLength={120} autoComplete="organization" aria-invalid={Boolean(fieldErrors.artistName)} aria-describedby={fieldErrors.artistName ? "artistName-error" : undefined} />
          <FieldError errors={fieldErrors} name="artistName" />
        </label>
        <label>
          <span>E-mail address *</span>
          <input name="email" required type="email" maxLength={180} autoComplete="email" aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? "email-error" : undefined} />
          <FieldError errors={fieldErrors} name="email" />
        </label>
        <label>
          <span>Instagram *</span>
          <input name="instagram" required maxLength={300} placeholder="https://instagram.com/…" aria-invalid={Boolean(fieldErrors.instagram)} aria-describedby={fieldErrors.instagram ? "instagram-error" : undefined} />
          <FieldError errors={fieldErrors} name="instagram" />
        </label>
        <label>
          <span>SoundCloud *</span>
          <input name="soundcloud" required type="url" maxLength={500} placeholder="https://soundcloud.com/…" aria-invalid={Boolean(fieldErrors.soundcloud)} aria-describedby={fieldErrors.soundcloud ? "soundcloud-error" : undefined} />
          <FieldError errors={fieldErrors} name="soundcloud" />
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
          <input name="guestMixTitle" required maxLength={180} placeholder="Radio ACCU Guest Mix | Artist Name" aria-invalid={Boolean(fieldErrors.guestMixTitle)} aria-describedby={fieldErrors.guestMixTitle ? "guestMixTitle-error" : undefined} />
          <FieldError errors={fieldErrors} name="guestMixTitle" />
        </label>
        <label>
          <span>Mix length *</span>
          <input name="mixLength" required readOnly value="60 minutes" />
        </label>
        <label>
          <span>Audio format *</span>
          <select name="audioFormat" required defaultValue="" aria-invalid={Boolean(fieldErrors.audioFormat)} aria-describedby={fieldErrors.audioFormat ? "audioFormat-error" : undefined}>
            <option value="" disabled>Select a format</option>
            <option>WAV</option>
            <option>AIFF</option>
            <option>320 kbps MP3</option>
          </select>
          <FieldError errors={fieldErrors} name="audioFormat" />
        </label>
        <label>
          <span>Exclusive to Radio ACCU? *</span>
          <select name="exclusive" required defaultValue="" aria-invalid={Boolean(fieldErrors.exclusive)} aria-describedby={fieldErrors.exclusive ? "exclusive-error" : undefined}>
            <option value="" disabled>Select an answer</option>
            <option>Yes</option>
            <option>No</option>
          </select>
          <FieldError errors={fieldErrors} name="exclusive" />
        </label>
        <label className="form-span-2">
          <span>Mix download link *</span>
          <input name="downloadLink" required type="url" maxLength={1000} placeholder="Dropbox, WeTransfer, Google Drive…" aria-invalid={Boolean(fieldErrors.downloadLink)} aria-describedby={fieldErrors.downloadLink ? "downloadLink-error" : undefined} />
          <FieldError errors={fieldErrors} name="downloadLink" />
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
          <textarea name="biography" required maxLength={2400} rows={10} aria-invalid={Boolean(fieldErrors.biography)} aria-describedby={fieldErrors.biography ? "biography-error" : undefined} />
          <FieldError errors={fieldErrors} name="biography" />
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
          <input name="pressPhotoLink" required type="url" maxLength={1000} aria-invalid={Boolean(fieldErrors.pressPhotoLink)} aria-describedby={fieldErrors.pressPhotoLink ? "pressPhotoLink-error" : undefined} />
          <FieldError errors={fieldErrors} name="pressPhotoLink" />
        </label>
        <label>
          <span>Electronic Press Kit link</span>
          <input name="epkLink" type="url" maxLength={1000} aria-invalid={Boolean(fieldErrors.epkLink)} aria-describedby={fieldErrors.epkLink ? "epkLink-error" : undefined} />
          <FieldError errors={fieldErrors} name="epkLink" />
        </label>
        <label>
          <span>Artist logo link</span>
          <input name="artistLogoLink" type="url" maxLength={1000} aria-invalid={Boolean(fieldErrors.artistLogoLink)} aria-describedby={fieldErrors.artistLogoLink ? "artistLogoLink-error" : undefined} />
          <FieldError errors={fieldErrors} name="artistLogoLink" />
        </label>
        <label>
          <span>Current promotional artwork link</span>
          <input name="promoArtworkLink" type="url" maxLength={1000} aria-invalid={Boolean(fieldErrors.promoArtworkLink)} aria-describedby={fieldErrors.promoArtworkLink ? "promoArtworkLink-error" : undefined} />
          <FieldError errors={fieldErrors} name="promoArtworkLink" />
        </label>
        <label className="form-span-2">
          <span>Station Voice ID link</span>
          <input name="voiceIdLink" type="url" maxLength={1000} aria-invalid={Boolean(fieldErrors.voiceIdLink)} aria-describedby={fieldErrors.voiceIdLink ? "voiceIdLink-error" : undefined} />
          <FieldError errors={fieldErrors} name="voiceIdLink" />
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

      <div
        className={`release-date-picker${fieldErrors.preferredReleasePeriod ? " invalid" : ""}`}
        data-release-date-picker
        tabIndex={-1}
        aria-invalid={Boolean(fieldErrors.preferredReleasePeriod)}
        aria-describedby={fieldErrors.preferredReleasePeriod ? "preferredReleasePeriod-error" : undefined}
      >
        <div className="release-date-picker-heading">
          <div>
            <span>Preferred release dates *</span>
            <small>Choose up to five weekdays. Radio ACCU will confirm the final release date by e-mail.</small>
          </div>
          <strong>{selectedReleaseDates.length} / {MAX_RELEASE_DATES} selected</strong>
        </div>

        <FieldError errors={fieldErrors} name="preferredReleasePeriod" />

        <div className="release-date-months">
          {releaseDateGroups.map((group, groupIndex) => {
            const selectedInMonth = group.choices.filter((choice) => selectedReleaseDates.includes(choice.date)).length;
            return (
              <details key={group.month} open={groupIndex === 0 ? true : undefined}>
                <summary>
                  <span>{group.month}</span>
                  <span>{selectedInMonth ? `${selectedInMonth} selected` : `${group.choices.length} weekdays`}</span>
                </summary>
                <div className="release-date-options">
                  {group.choices.map((choice) => {
                    const selected = selectedReleaseDates.includes(choice.date);
                    const disabled = !selected && selectedReleaseDates.length >= MAX_RELEASE_DATES;
                    return (
                      <label className={selected ? "selected" : ""} key={choice.date}>
                        <input
                          type="checkbox"
                          checked={selected}
                          disabled={disabled}
                          onChange={() => toggleReleaseDate(choice.date)}
                        />
                        <span>{choice.label}</span>
                      </label>
                    );
                  })}
                </div>
              </details>
            );
          })}
        </div>
      </div>

      <div className="form-section-heading">
        <span>06</span>
        <div>
          <p>Permissions</p>
          <h2>Confirm your submission</h2>
        </div>
      </div>

      <label className={`form-consent${fieldErrors.publicationPermission ? " invalid" : ""}`}>
        <input name="publicationPermission" type="checkbox" required aria-invalid={Boolean(fieldErrors.publicationPermission)} aria-describedby={fieldErrors.publicationPermission ? "publicationPermission-error" : undefined} />
        <span>I grant Radio ACCU permission to publish, stream, archive and promote this Guest Mix across its website, YouTube, SoundCloud, Mixcloud and social channels. *<FieldError errors={fieldErrors} name="publicationPermission" /></span>
      </label>
      <label className={`form-consent${fieldErrors.archivePermission ? " invalid" : ""}`}>
        <input name="archivePermission" type="checkbox" required aria-invalid={Boolean(fieldErrors.archivePermission)} aria-describedby={fieldErrors.archivePermission ? "archivePermission-error" : undefined} />
        <span>I understand that the Guest Mix may remain available in the Radio ACCU archive unless otherwise agreed. *<FieldError errors={fieldErrors} name="archivePermission" /></span>
      </label>
      <label className={`form-consent${fieldErrors.privacyConsent ? " invalid" : ""}`}>
        <input name="privacyConsent" type="checkbox" required aria-invalid={Boolean(fieldErrors.privacyConsent)} aria-describedby={fieldErrors.privacyConsent ? "privacyConsent-error" : undefined} />
        <span>I agree that Radio ACCU may store these details to prepare, publish and contact me about this Guest Mix. *<FieldError errors={fieldErrors} name="privacyConsent" /></span>
      </label>

      <label className="form-honeypot" aria-hidden="true">
        <span>Company</span>
        <input name="company" tabIndex={-1} autoComplete="off" />
      </label>

      <div className="form-submit-row">
        <div className="form-submit-copy">
          <span>Final check</span>
          <strong>Send your signal to ACCU.</strong>
          <p>Review the information above. Required fields are marked with an asterisk.</p>
        </div>

        <div className="form-submit-action">
          <button disabled={state === "sending" || state === "success"} type="submit">
            {state === "sending" ? "Connecting…" : state === "success" ? "Submission received" : "Submit Guest Mix"}
            <span aria-hidden="true">↗</span>
          </button>
          <p className={`form-response ${state}`} aria-live="polite">
            {message || "Your submission is stored privately and reviewed by the Radio ACCU team."}
          </p>
        </div>

        <div className="form-submit-process" aria-label="What happens after submission">
          <div>
            <span>01</span>
            <strong>Received</strong>
            <p>Your details and links are saved securely in ACCU HQ.</p>
          </div>
          <div>
            <span>02</span>
            <strong>Reviewed</strong>
            <p>The ACCU team checks your mix and promotional assets.</p>
          </div>
          <div>
            <span>03</span>
            <strong>Confirmed</strong>
            <p>We contact you by e-mail with the final release date.</p>
          </div>
        </div>
      </div>
    </form>
  );
}
