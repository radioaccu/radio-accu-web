import nodemailer from "nodemailer";

export const runtime = "nodejs";

type GuestMixPayload = Record<string, unknown> & {
  exclusive?: unknown;
  rightsConfirmed?: unknown;
  publicationPermission?: unknown;
  archivePermission?: unknown;
  privacyConsent?: unknown;
};

const limits = {
  artistName: 120,
  email: 180,
  country: 100,
  instagram: 300,
  soundcloud: 500,
  spotify: 500,
  mixcloud: 500,
  artistWebsite: 500,
  guestMixTitle: 180,
  mixLength: 50,
  audioFormat: 50,
  downloadLink: 1000,
  tracklist: 8000,
  biography: 2400,
  recordLabels: 1000,
  releases: 1600,
  promotionNotes: 1600,
  pressPhotoLink: 1000,
  epkLink: 1000,
  artistLogoLink: 1000,
  promoArtworkLink: 1000,
  voiceIdLink: 1000,
  preferredReleasePeriod: 700,
  datesToAvoid: 700,
} as const;

function text(value: unknown, maximum: number) {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}

function wordCount(value: string) {
  return value.split(/\s+/).filter(Boolean).length;
}

function isHttpUrl(value: string) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

function field(label: string, value: string) {
  const safeValue = escapeHtml(value || "—").replace(/\n/g, "<br />");
  return `<tr><td style="padding:10px 14px;border:1px solid #d8d8d2;color:#555;vertical-align:top;width:210px">${label}</td><td style="padding:10px 14px;border:1px solid #d8d8d2;vertical-align:top">${safeValue}</td></tr>`;
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 80_000) {
    return Response.json({ message: "This submission is too large." }, { status: 413 });
  }

  let raw: GuestMixPayload;
  try {
    raw = await request.json() as GuestMixPayload;
  } catch {
    return Response.json({ message: "Invalid submission data." }, { status: 400 });
  }

  if (text(raw.company, 200)) return Response.json({ ok: true });

  const submission = {
    artistName: text(raw.artistName, limits.artistName),
    email: text(raw.email, limits.email),
    country: text(raw.country, limits.country),
    instagram: text(raw.instagram, limits.instagram),
    soundcloud: text(raw.soundcloud, limits.soundcloud),
    spotify: text(raw.spotify, limits.spotify),
    mixcloud: text(raw.mixcloud, limits.mixcloud),
    artistWebsite: text(raw.artistWebsite, limits.artistWebsite),
    guestMixTitle: text(raw.guestMixTitle, limits.guestMixTitle),
    mixLength: text(raw.mixLength, limits.mixLength),
    audioFormat: text(raw.audioFormat, limits.audioFormat),
    exclusive: raw.exclusive === true,
    downloadLink: text(raw.downloadLink, limits.downloadLink),
    tracklist: text(raw.tracklist, limits.tracklist),
    biography: text(raw.biography, limits.biography),
    recordLabels: text(raw.recordLabels, limits.recordLabels),
    releases: text(raw.releases, limits.releases),
    promotionNotes: text(raw.promotionNotes, limits.promotionNotes),
    pressPhotoLink: text(raw.pressPhotoLink, limits.pressPhotoLink),
    epkLink: text(raw.epkLink, limits.epkLink),
    artistLogoLink: text(raw.artistLogoLink, limits.artistLogoLink),
    promoArtworkLink: text(raw.promoArtworkLink, limits.promoArtworkLink),
    voiceIdLink: text(raw.voiceIdLink, limits.voiceIdLink),
    preferredReleasePeriod: text(raw.preferredReleasePeriod, limits.preferredReleasePeriod),
    datesToAvoid: text(raw.datesToAvoid, limits.datesToAvoid),
    rightsConfirmed: raw.rightsConfirmed === true,
    publicationPermission: raw.publicationPermission === true,
    archivePermission: raw.archivePermission === true,
    privacyConsent: raw.privacyConsent === true,
  };

  const required = [
    submission.artistName,
    submission.email,
    submission.country,
    submission.instagram,
    submission.soundcloud,
    submission.guestMixTitle,
    submission.mixLength,
    submission.audioFormat,
    submission.downloadLink,
    submission.biography,
    submission.pressPhotoLink,
  ];
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submission.email);
  const biographyWords = wordCount(submission.biography);
  const exclusiveWasAnswered = typeof raw.exclusive === "boolean";
  const links = [
    submission.soundcloud,
    submission.spotify,
    submission.mixcloud,
    submission.artistWebsite,
    submission.downloadLink,
    submission.pressPhotoLink,
    submission.epkLink,
    submission.artistLogoLink,
    submission.promoArtworkLink,
    submission.voiceIdLink,
  ];

  if (required.some((value) => !value) || !validEmail || !exclusiveWasAnswered) {
    return Response.json({ message: "Please complete all required fields correctly." }, { status: 400 });
  }
  if (links.some((value) => !isHttpUrl(value))) {
    return Response.json({ message: "Please check that every submitted link starts with https:// or http://." }, { status: 400 });
  }
  if (biographyWords < 100 || biographyWords > 250) {
    return Response.json({ message: "The biography must contain between 100 and 250 words." }, { status: 400 });
  }
  if (
    !submission.rightsConfirmed ||
    !submission.publicationPermission ||
    !submission.archivePermission ||
    !submission.privacyConsent
  ) {
    return Response.json({ message: "All permission confirmations are required." }, { status: 400 });
  }

  const webhookUrl = process.env.GOOGLE_APPS_SCRIPT_GM_WEBHOOK_URL;
  const webhookSecret = process.env.GM_WEBHOOK_SECRET;
  if (!webhookUrl || !webhookSecret) {
    return Response.json(
      { message: "The Guest Mix connection is not active yet. Please contact info@radioaccu.com." },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: webhookSecret, submission }),
      redirect: "follow",
      signal: AbortSignal.timeout(20_000),
    });
    const result = await response.json() as { ok?: boolean; message?: string };

    if (!response.ok || !result.ok) {
      throw new Error(result.message || `Google Sheets returned ${response.status}`);
    }
  } catch (error) {
    console.error("Guest Mix spreadsheet update failed", error);
    return Response.json(
      { message: error instanceof Error ? error.message : "The spreadsheet could not be updated. Please try again." },
      { status: 502 },
    );
  }

  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;
  if (smtpUser && smtpPassword) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp-auth.mailprotect.be",
      port: Number(process.env.SMTP_PORT || 465),
      secure: Number(process.env.SMTP_PORT || 465) === 465,
      auth: { user: smtpUser, pass: smtpPassword },
    });
    const fromName = (process.env.SMTP_FROM_NAME || "Radio ACCU Website").replace(/[\r\n"]/g, "");
    const destination = process.env.SUBMISSION_TO_EMAIL || "info@radioaccu.com";
    const cleanArtist = submission.artistName.replace(/[\r\n]/g, " ");
    const rows = [
      field("Artist / DJ", submission.artistName),
      field("E-mail", submission.email),
      field("Country", submission.country),
      field("Guest Mix title", submission.guestMixTitle),
      field("Audio format", submission.audioFormat),
      field("Download link", submission.downloadLink),
      field("Press photo", submission.pressPhotoLink),
      field("Preferred release period", submission.preferredReleasePeriod),
      field("Dates to avoid", submission.datesToAvoid),
    ].join("");

    try {
      await Promise.all([
        transporter.sendMail({
          from: `"${fromName}" <${smtpUser}>`,
          to: destination,
          replyTo: submission.email,
          subject: `Guest Mix submission — ${cleanArtist}`,
          text: `A new Guest Mix submission from ${submission.artistName} has been saved in ACCU HQ.\n\nOpen the Guest Mixes sheet to review all information and files.`,
          html: `<div style="font-family:Arial,sans-serif;color:#111"><h1 style="font-size:24px">New Guest Mix submission</h1><table style="border-collapse:collapse;width:100%;max-width:900px">${rows}</table><p>Open ACCU HQ to review the complete submission.</p></div>`,
        }),
        transporter.sendMail({
          from: `"${fromName}" <${smtpUser}>`,
          to: submission.email,
          replyTo: destination,
          subject: `Radio ACCU received your Guest Mix — ${cleanArtist}`,
          text: `Hi ${submission.artistName},\n\nThank you. Radio ACCU has received your Guest Mix submission and files. We will review everything and confirm the release date by e-mail.\n\nAndy\nTeam Radio ACCU`,
          html: `<div style="font-family:Arial,sans-serif;color:#111;line-height:1.6"><h1 style="font-size:24px">Submission received</h1><p>Hi ${escapeHtml(submission.artistName)},</p><p>Thank you. Radio ACCU has received your Guest Mix submission and files. We will review everything and confirm the release date by e-mail.</p><p>Andy<br />Team Radio ACCU</p></div>`,
        }),
      ]);
    } catch (error) {
      console.error("Guest Mix confirmation e-mail failed after the spreadsheet was updated", error);
    }
  }

  return Response.json({ ok: true });
}
