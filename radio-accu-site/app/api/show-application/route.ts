import nodemailer from "nodemailer";

export const runtime = "nodejs";

type ApplicationPayload = {
  artistName?: unknown;
  contactName?: unknown;
  email?: unknown;
  phone?: unknown;
  location?: unknown;
  showTitle?: unknown;
  showFormat?: unknown;
  genres?: unknown;
  description?: unknown;
  links?: unknown;
  preferredDates?: unknown;
  technicalRequirements?: unknown;
  additionalNotes?: unknown;
  consent?: unknown;
  website?: unknown;
};

const limits = {
  artistName: 100,
  contactName: 100,
  email: 180,
  phone: 50,
  location: 120,
  showTitle: 140,
  showFormat: 80,
  genres: 200,
  description: 2400,
  links: 1200,
  preferredDates: 700,
  technicalRequirements: 1200,
  additionalNotes: 1200,
} as const;

function text(value: unknown, maximum: number) {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
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
  return `<tr><td style="padding:10px 14px;border:1px solid #d8d8d2;color:#555;vertical-align:top;width:190px">${label}</td><td style="padding:10px 14px;border:1px solid #d8d8d2;vertical-align:top">${safeValue}</td></tr>`;
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 30_000) {
    return Response.json({ message: "This application is too large." }, { status: 413 });
  }

  let raw: ApplicationPayload;
  try {
    raw = await request.json() as ApplicationPayload;
  } catch {
    return Response.json({ message: "Invalid application data." }, { status: 400 });
  }

  if (text(raw.website, 200)) {
    return Response.json({ ok: true });
  }

  const application = {
    artistName: text(raw.artistName, limits.artistName),
    contactName: text(raw.contactName, limits.contactName),
    email: text(raw.email, limits.email),
    phone: text(raw.phone, limits.phone),
    location: text(raw.location, limits.location),
    showTitle: text(raw.showTitle, limits.showTitle),
    showFormat: text(raw.showFormat, limits.showFormat),
    genres: text(raw.genres, limits.genres),
    description: text(raw.description, limits.description),
    links: text(raw.links, limits.links),
    preferredDates: text(raw.preferredDates, limits.preferredDates),
    technicalRequirements: text(raw.technicalRequirements, limits.technicalRequirements),
    additionalNotes: text(raw.additionalNotes, limits.additionalNotes),
  };

  const required = [
    application.artistName,
    application.contactName,
    application.email,
    application.location,
    application.showTitle,
    application.showFormat,
    application.genres,
    application.description,
    application.links,
    application.preferredDates,
  ];
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(application.email);

  if (required.some((value) => !value) || !validEmail || raw.consent !== true) {
    return Response.json({ message: "Please complete all required fields correctly." }, { status: 400 });
  }

  if (application.description.length < 80) {
    return Response.json({ message: "Please describe the show in at least 80 characters." }, { status: 400 });
  }

  const host = process.env.SMTP_HOST || "smtp-auth.mailprotect.be";
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  const destination = process.env.SUBMISSION_TO_EMAIL || "info@radioaccu.com";
  const fromName = process.env.SMTP_FROM_NAME || "Radio ACCU Website";

  if (!user || !password) {
    return Response.json(
      { message: "The application mailbox is not connected yet. Please e-mail info@radioaccu.com for now." },
      { status: 503 },
    );
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass: password },
  });

  const cleanSubjectName = application.artistName.replace(/[\r\n]/g, " ");
  const rows = [
    field("Artist / collective", application.artistName),
    field("Contact name", application.contactName),
    field("E-mail", application.email),
    field("Phone", application.phone),
    field("City / country", application.location),
    field("Show title", application.showTitle),
    field("Format", application.showFormat),
    field("Genres / direction", application.genres),
    field("Show description", application.description),
    field("Listening / portfolio links", application.links),
    field("Preferred dates", application.preferredDates),
    field("Technical requirements", application.technicalRequirements),
    field("Additional notes", application.additionalNotes),
  ].join("");

  const plainText = [
    "NEW RADIO ACCU SHOW PROPOSAL",
    "",
    `Artist / collective: ${application.artistName}`,
    `Contact name: ${application.contactName}`,
    `E-mail: ${application.email}`,
    `Phone: ${application.phone || "—"}`,
    `City / country: ${application.location}`,
    `Show title: ${application.showTitle}`,
    `Format: ${application.showFormat}`,
    `Genres / direction: ${application.genres}`,
    `Show description:\n${application.description}`,
    `Listening / portfolio links:\n${application.links}`,
    `Preferred dates:\n${application.preferredDates}`,
    `Technical requirements:\n${application.technicalRequirements || "—"}`,
    `Additional notes:\n${application.additionalNotes || "—"}`,
  ].join("\n\n");

  try {
    await transporter.sendMail({
      from: `"${fromName.replace(/[\r\n"]/g, "")}" <${user}>`,
      to: destination,
      replyTo: application.email,
      subject: `Show proposal — ${cleanSubjectName}`,
      text: plainText,
      html: `<div style="font-family:Arial,sans-serif;color:#111"><h1 style="font-size:24px">New Radio ACCU show proposal</h1><table style="border-collapse:collapse;width:100%;max-width:900px">${rows}</table></div>`,
    });
  } catch (error) {
    console.error("Show application e-mail failed", error);
    return Response.json({ message: "The e-mail could not be sent. Please try again later." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
