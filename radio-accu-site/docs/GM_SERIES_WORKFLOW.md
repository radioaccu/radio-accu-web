# Radio ACCU Guest Mix workflow

## Safe data flow

1. Send every invited artist the private Google Form link.
2. Their response enters the private ACCU HQ spreadsheet and existing trackers.
3. Review the mix, rights, biography and assets internally.
4. Add the final public artwork, SoundCloud and/or YouTube links.
5. Change the row status in `Guest Mixes` to `Published`, `Released` or `Live`.
6. `Website GM` is refreshed automatically and contains public fields only.
7. The website reads that tab every five minutes once the GM Series is enabled.

Replies sent as ordinary free-form e-mail cannot be mapped reliably. The invite
mail should therefore always send the artist to the existing private form.

## One-time Google Sheets setup

1. Open ACCU HQ and choose **Extensions → Apps Script**.
2. Add the contents of `integrations/google-apps-script/guest-mix-public-feed.gs`.
3. Run `setupAccuGuestMixPublicFeed` once and approve the requested access.
4. In Google Sheets, publish only `Website GM` as CSV and copy its CSV URL.

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
