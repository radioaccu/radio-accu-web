# Radio ACCU Guest Mix workflow

## Safe data flow

1. Optionally add the invited artist and e-mail address to `Invite Tracker`.
2. Send the artist the private portal link: `https://submit.radioaccu.com/guest-mix-submit`.
3. The artist completes the separate branded portal on `submit.radioaccu.com`.
4. Their response updates `Guest Mixes` and marks the invitation as `Submitted`.
5. Review the mix, rights, biography and assets internally.
6. Add the final public artwork, SoundCloud and/or YouTube links.
7. Change the row status in `Guest Mixes` to `Published`, `Released` or `Live`.
8. `Website GM` is refreshed automatically and contains public fields only.
9. The website reads that tab every five minutes once the GM Series is enabled.

Replies sent as ordinary free-form e-mail cannot be mapped reliably. The invite
mail should therefore always contain the private portal link.

## One-time Google Sheets setup

1. Open ACCU HQ and choose **Extensions → Apps Script**.
2. Add the contents of both scripts:
   - `integrations/google-apps-script/guest-mix-submission-endpoint.gs`
   - `integrations/google-apps-script/guest-mix-public-feed.gs`
3. Run `setupAccuGuestMixSubmissionEndpoint` once and approve access.
4. Copy `GM_WEBHOOK_SECRET` from the execution log. Keep it private.
5. Choose **Deploy → New deployment → Web app**.
6. Select **Execute as me** and **Who has access: Anyone**, then deploy.
7. Copy the deployment URL ending in `/exec`.
8. Add both values to the local `.dev.vars` file and to Cloudflare secrets:

```text
GOOGLE_APPS_SCRIPT_GM_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
GM_WEBHOOK_SECRET=the-secret-from-the-execution-log
```

9. Run `setupAccuGuestMixPublicFeed` once.
10. In Google Sheets, publish only `Website GM` as CSV and copy its CSV URL.

## Sending the private portal

1. Send `https://submit.radioaccu.com/guest-mix-submit` to an invited artist.
2. The artist completes the form without an invitation code.
3. Optionally add their name and e-mail to `Invite Tracker`; the status is then
   updated to `Submitted` when the same e-mail address is used in the form.
4. The same portal can be used again if the artist needs to correct an answer.

The e-mail address is the unique match. A repeated submission with the same
e-mail address updates the existing Guest Mix row instead of creating a duplicate.

The portal is intentionally separated from the public Radio ACCU website. Its
private portal uses `https://submit.radioaccu.com/guest-mix-submit` and
the page is not present in the public navigation or search index.

Never publish `Form Responses`, `Submission Log`, `Guest Mixes`, e-mail
addresses, private download links or permission records.

## Website launch settings

Keep this disabled until the series starts:

```text
GM_SERIES_ENABLED=false
GOOGLE_SHEET_GM_CSV_URL=
```

At launch, add the published `Website GM` CSV URL and set:

```text
GM_SERIES_ENABLED=true
```

Then deploy the website again. The navigation and the GM page will become
visible together.
