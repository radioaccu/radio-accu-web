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

Publish only the website schedule tab as CSV and add its public URL to
`.env.local`:

```text
GOOGLE_SHEET_SCHEDULE_CSV_URL=https://docs.google.com/spreadsheets/d/.../pub?output=csv
```

Without that variable, the website uses the four local example slots.

## Resident images from Dropbox

Resident images use this structure:

```text
/ACCU/Residents/
  vincent-neumann/profile.jpg
  bashti/profile.jpg
  aura/profile.jpg
  sohirab/profile.jpg
```

The website proxies the images through its own server route, so Dropbox secrets
never reach the browser. Add these values to `.env.local`:

```text
DROPBOX_APP_KEY=
DROPBOX_APP_SECRET=
DROPBOX_REFRESH_TOKEN=
DROPBOX_RESIDENTS_ROOT=/ACCU/Residents
```

Until Dropbox is configured or when an image is missing, the industrial ACCU
placeholder remains visible.

## Checks

```bash
npm run lint
npm run build
```
