# Radio ACCU

Official Radio ACCU website built with Next.js, TypeScript and the App Router.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Public schedule from Google Sheets

The website can read a public schedule tab every five minutes. Use these exact
column names:

| Date | Start | End | Artist | Status |
|---|---|---|---|---|
| 2026-08-02 | 14:00 | 15:00 | Tusais | Confirmed |
| 2026-08-02 | 15:00 | 16:00 | Nag | Confirmed |
| 2026-08-02 | 16:00 | 17:00 | Toolbox | Confirmed |
| 2026-08-02 | 17:00 | 18:00 | Mon Tubee | Confirmed |

Only `Confirmed`, `Published` and `Live` rows are public. Every row has its own
start and end time, so extended broadcasts and extra broadcast dates work
without code changes.

The current public ACCU schedule CSV is connected in the schedule adapter.
`GOOGLE_SHEET_SCHEDULE_CSV_URL` can still be used to override that source in
another environment:

```text
GOOGLE_SHEET_SCHEDULE_CSV_URL=https://docs.google.com/spreadsheets/d/.../pub?output=csv
```

Without that variable, the website uses the four local example slots.

## Resident images from Dropbox

The current Full Dropbox connection discovers every first-level resident folder
inside:

```text
/RADIO ACCU RESIDENTS/
```

The website automatically chooses the strongest usable JPG, PNG or WebP image
inside each resident folder. It prefers press, profile and portrait images and
avoids files named logo, flyer, poster, artwork or gigs. Images are proxied
through the website, so Dropbox secrets never reach the browser. Add these
values to `.env.local`:

```text
DROPBOX_ACCESS_TOKEN=
```

The generated token is intended for the first local test. Permanent hosting uses
a refresh token:

```text
DROPBOX_APP_KEY=
DROPBOX_APP_SECRET=
DROPBOX_REFRESH_TOKEN=
DROPBOX_RESIDENTS_ROOT=/ACCU/Residents
```

Until Dropbox is configured or when an image is missing, the industrial ACCU
placeholder remains visible.

Each resident name in the directory opens an individual `/residents/[slug]` profile. These
profiles automatically show all browser-ready images and videos in that
resident folder. Word files with `bio` in their filename or folder are rendered
as biography text. PDFs, riders, and other private documents are never exposed
through the public media route.

## Show applications by e-mail

The public `/submit` form validates every request on the server and sends the
completed proposal directly to the Radio ACCU mailbox through Combell SMTP.
Add these values to `.env.local` locally and to the hosting environment later:

```text
SMTP_HOST=smtp-auth.mailprotect.be
SMTP_PORT=465
SMTP_USER=info@radioaccu.com
SMTP_PASSWORD=YOUR_COMBELL_MAILBOX_PASSWORD
SMTP_FROM_NAME=Radio ACCU Website
SUBMISSION_TO_EMAIL=info@radioaccu.com
```

The mailbox password stays server-side and `.env.local` is excluded from Git.
Messages are sent from the ACCU mailbox with the applicant set as `Reply-To`,
so replying to the notification starts a normal conversation with the artist.

## Video and audio archive

The `/archive` page contains the complete Radio ACCU YouTube uploads playlist,
the 15 most recent videos as internal archive cards, and the complete SoundCloud
profile player. Individual YouTube videos open inside the website at
`/archive/watch/[videoId]`.

## Checks

```bash
npm run lint
npm run build
```

## Cloudflare Workers

The production site is prepared for Cloudflare Workers through OpenNext. Your
laptop is only needed to edit and preview the website; Cloudflare keeps the
published site online.

### Local Cloudflare preview

Copy the example variable file once and fill it with the same private values as
your local environment:

```bash
cp .dev.vars.example .dev.vars
npm run preview
```

Open `http://localhost:8787`. Both `.env.local` and `.dev.vars` are ignored by
Git and must never be committed.

### First Cloudflare deployment

Connect the GitHub repository to Cloudflare Workers Builds and use:

```text
Root directory: radio-accu-site
Deploy command: npm run deploy
```

Add every variable listed in `.dev.vars.example` to the Cloudflare project as a
secret or environment variable. Publish to the temporary `workers.dev` address
first and test the schedule, residents, archive and submission form before
connecting the final domain.

### Daily maintenance

- Schedule changes are made in the connected Google Sheet.
- Resident folders, images, biography and social links are maintained in
  Dropbox.
- Website text or design changes are committed and pushed to GitHub. Cloudflare
  then publishes them automatically.
- Never paste Dropbox, SMTP or other passwords into GitHub files.

When the final domain is moved to Cloudflare DNS, preserve the existing Combell
mail records (MX, SPF, DKIM and DMARC) so `info@radioaccu.com` keeps working.
