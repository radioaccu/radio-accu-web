/**
 * Radio ACCU — private Guest Mix submission endpoint
 *
 * Add this file to the Apps Script project attached to ACCU HQ. Deploy the
 * project as a Web app that executes as you and can be accessed by anyone.
 * Every request still requires the private server secret. Artists do not need
 * an invitation code; repeat submissions are matched by e-mail address.
 */

const ACCU_GM_SUBMISSION = {
  INVITE_SHEET: 'Invite Tracker',
  GUEST_MIX_SHEET: 'Guest Mixes',
  DEFAULT_FORM_URL: 'https://submit.radioaccu.com/guest-mix-submit',
  PUBLIC_STATUSES: ['published', 'released', 'live'],
  GUEST_MIX_HEADERS: [
    'Invite Token',
    'GM Code',
    'Artist / DJ Name',
    'Email Address',
    'Country',
    'Instagram',
    'SoundCloud Profile',
    'Spotify Artist Page',
    'Mixcloud',
    'Website',
    'Guest Mix Title',
    'Mix Length',
    'Audio Format',
    'Exclusive',
    'Download Link',
    'Tracklist',
    'Biography',
    'Record Labels',
    'Recent or Upcoming Releases',
    'Promotion Notes',
    'Press Photo Link',
    'EPK Link',
    'Artist Logo Link',
    'Promo Artwork Link',
    'Voice ID Link',
    'Preferred Release Period',
    'Rights Confirmed',
    'Publication Permission',
    'Archive Permission',
    'Status',
    'Submitted At',
    'Release Date',
    'Artwork URL',
    'SoundCloud URL',
    'YouTube URL',
  ],
};

function setupAccuGuestMixSubmissionEndpoint() {
  const properties = PropertiesService.getScriptProperties();
  const spreadsheet = SpreadsheetApp.getActive();
  if (!spreadsheet) throw new Error('Open this script from the ACCU HQ spreadsheet and run setup again.');

  properties.setProperty('GM_SPREADSHEET_ID', spreadsheet.getId());
  if (!properties.getProperty('GM_WEBHOOK_SECRET')) {
    properties.setProperty(
      'GM_WEBHOOK_SECRET',
      Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, ''),
    );
  }

  refreshAccuGuestMixInviteLinks();
  console.log('GM_WEBHOOK_SECRET=' + properties.getProperty('GM_WEBHOOK_SECRET'));
  console.log('Copy this value into the Cloudflare secret GM_WEBHOOK_SECRET.');
}

function refreshAccuGuestMixInviteLinks() {
  const spreadsheet = getAccuGuestMixSpreadsheet_();
  const sheet = spreadsheet.getSheetByName(ACCU_GM_SUBMISSION.INVITE_SHEET);
  if (!sheet) throw new Error('Sheet "Invite Tracker" was not found.');

  ensureGuestMixHeaders_(sheet, ['Private Form URL', 'Status', 'Submitted At']);
  const headerMap = guestMixHeaderMap_(sheet);
  const artistColumn = guestMixHeader_(headerMap, ['Artist', 'Artist Name', 'Artist / DJ Name']);
  const emailColumn = guestMixHeader_(headerMap, ['Email', 'Email Address']);
  const linkColumn = guestMixHeader_(headerMap, ['Private Form URL']);
  const formUrl = PropertiesService.getScriptProperties().getProperty('GM_FORM_BASE_URL') ||
    ACCU_GM_SUBMISSION.DEFAULT_FORM_URL;

  if (artistColumn === undefined || emailColumn === undefined) {
    throw new Error('Invite Tracker needs Artist and Email columns.');
  }

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const rows = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();

  rows.forEach((row, index) => {
    const artist = String(row[artistColumn] || '').trim();
    const email = String(row[emailColumn] || '').trim();
    if (!artist || !email) return;

    const rowNumber = index + 2;
    sheet.getRange(rowNumber, linkColumn + 1).setValue(formUrl);
  });
}

function doPost(event) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(20000);
    const body = JSON.parse((event && event.postData && event.postData.contents) || '{}');
    const expectedSecret = PropertiesService.getScriptProperties().getProperty('GM_WEBHOOK_SECRET');

    if (!expectedSecret || String(body.secret || '') !== expectedSecret) {
      return guestMixJson_({ ok: false, message: 'Unauthorized submission endpoint.' });
    }

    const submission = body.submission || {};
    const result = upsertGuestMixSubmission_(submission);
    updateGuestMixInvitationByEmail_(submission);

    return guestMixJson_({ ok: true, code: result.code, status: result.status });
  } catch (error) {
    console.error(error);
    return guestMixJson_({
      ok: false,
      message: error && error.message ? error.message : 'The Guest Mix submission could not be saved.',
    });
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

function upsertGuestMixSubmission_(submission) {
  const spreadsheet = getAccuGuestMixSpreadsheet_();
  let sheet = spreadsheet.getSheetByName(ACCU_GM_SUBMISSION.GUEST_MIX_SHEET);
  if (!sheet) sheet = spreadsheet.insertSheet(ACCU_GM_SUBMISSION.GUEST_MIX_SHEET);

  ensureGuestMixHeaders_(sheet, ACCU_GM_SUBMISSION.GUEST_MIX_HEADERS);
  const headerMap = guestMixHeaderMap_(sheet);
  const tokenColumn = guestMixHeader_(headerMap, ['Invite Token']);
  const emailColumn = guestMixHeader_(headerMap, ['Email Address']);
  const statusColumn = guestMixHeader_(headerMap, ['Status']);
  const codeColumn = guestMixHeader_(headerMap, ['GM Code']);
  const email = String(submission.email || '').trim().toLowerCase();
  const rows = sheet.getDataRange().getValues();
  let rowNumber = sheet.getLastRow() + 1;

  for (let index = 1; index < rows.length; index += 1) {
    if (String(rows[index][emailColumn] || '').trim().toLowerCase() === email) {
      rowNumber = index + 1;
      break;
    }
  }

  const existingRow = rowNumber <= sheet.getLastRow();
  const existing = existingRow
    ? sheet.getRange(rowNumber, 1, 1, sheet.getLastColumn()).getValues()[0]
    : [];
  const existingStatus = String(existing[statusColumn] || '').trim();
  const existingCode = String(existing[codeColumn] || '').trim();
  const status = ACCU_GM_SUBMISSION.PUBLIC_STATUSES.includes(existingStatus.toLowerCase())
    ? existingStatus
    : 'Submitted';

  const values = {
    'Invite Token': existingRow ? String(existing[tokenColumn] || '').trim() : '',
    'GM Code': existingCode || nextGuestMixCode_(sheet, codeColumn),
    'Artist / DJ Name': submission.artistName,
    'Email Address': submission.email,
    'Country': submission.country,
    'Instagram': submission.instagram,
    'SoundCloud Profile': submission.soundcloud,
    'Spotify Artist Page': submission.spotify,
    'Mixcloud': submission.mixcloud,
    'Website': submission.artistWebsite,
    'Guest Mix Title': submission.guestMixTitle,
    'Mix Length': submission.mixLength,
    'Audio Format': submission.audioFormat,
    'Exclusive': submission.exclusive ? 'Yes' : 'No',
    'Download Link': submission.downloadLink,
    'Tracklist': submission.tracklist,
    'Biography': submission.biography,
    'Record Labels': submission.recordLabels,
    'Recent or Upcoming Releases': submission.releases,
    'Promotion Notes': submission.promotionNotes,
    'Press Photo Link': submission.pressPhotoLink,
    'EPK Link': submission.epkLink,
    'Artist Logo Link': submission.artistLogoLink,
    'Promo Artwork Link': submission.promoArtworkLink,
    'Voice ID Link': submission.voiceIdLink,
    'Preferred Release Period': submission.preferredReleasePeriod,
    'Rights Confirmed': submission.rightsConfirmed ? 'Yes' : 'No',
    'Publication Permission': submission.publicationPermission ? 'Yes' : 'No',
    'Archive Permission': submission.archivePermission ? 'Yes' : 'No',
    'Status': status,
    'Submitted At': new Date(),
  };

  Object.keys(values).forEach((header) => {
    const column = guestMixHeader_(headerMap, [header]);
    sheet.getRange(rowNumber, column + 1).setValue(values[header]);
  });
  return { code: values['GM Code'], status };
}

function updateGuestMixInvitationByEmail_(submission) {
  const spreadsheet = getAccuGuestMixSpreadsheet_();
  const sheet = spreadsheet.getSheetByName(ACCU_GM_SUBMISSION.INVITE_SHEET);
  if (!sheet || sheet.getLastRow() < 2) return;

  ensureGuestMixHeaders_(sheet, ['Private Form URL', 'Status', 'Submitted At']);
  const headerMap = guestMixHeaderMap_(sheet);
  const emailColumn = guestMixHeader_(headerMap, ['Email', 'Email Address']);
  const statusColumn = guestMixHeader_(headerMap, ['Status']);
  const submittedColumn = guestMixHeader_(headerMap, ['Submitted At']);
  if (emailColumn === undefined) return;

  const email = String(submission.email || '').trim().toLowerCase();
  const rows = sheet.getDataRange().getValues();
  for (let index = 1; index < rows.length; index += 1) {
    if (String(rows[index][emailColumn] || '').trim().toLowerCase() !== email) continue;
    sheet.getRange(index + 1, statusColumn + 1).setValue('Submitted');
    sheet.getRange(index + 1, submittedColumn + 1).setValue(new Date());
    return;
  }
}

function nextGuestMixCode_(sheet, codeColumn) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 'GM-001';

  const codes = sheet.getRange(2, codeColumn + 1, lastRow - 1, 1).getDisplayValues();
  const highest = codes.reduce((maximum, row) => {
    const match = String(row[0] || '').match(/^GM[- /]?(\d+)$/i);
    return match ? Math.max(maximum, Number(match[1])) : maximum;
  }, 0);

  return 'GM-' + String(highest + 1).padStart(3, '0');
}

function ensureGuestMixHeaders_(sheet, requiredHeaders) {
  const lastColumn = sheet.getLastColumn();
  if (lastColumn === 0 || sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, requiredHeaders.length).setValues([requiredHeaders]);
    sheet.setFrozenRows(1);
    return;
  }

  const headers = sheet.getRange(1, 1, 1, lastColumn).getDisplayValues()[0];
  const existing = new Set(headers.map(normaliseGuestMixHeader_));
  const missing = requiredHeaders.filter((header) => !existing.has(normaliseGuestMixHeader_(header)));

  if (missing.length) {
    sheet.getRange(1, headers.length + 1, 1, missing.length).setValues([missing]);
  }
  sheet.setFrozenRows(1);
}

function getAccuGuestMixSpreadsheet_() {
  const properties = PropertiesService.getScriptProperties();
  const spreadsheetId = properties.getProperty('GM_SPREADSHEET_ID');
  if (!spreadsheetId) {
    throw new Error('Run setupAccuGuestMixSubmissionEndpoint once before deploying the web app.');
  }
  return SpreadsheetApp.openById(spreadsheetId);
}

function guestMixHeaderMap_(sheet) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
  return new Map(headers.map((header, index) => [normaliseGuestMixHeader_(header), index]));
}

function guestMixHeader_(headerMap, names) {
  for (const name of names) {
    const column = headerMap.get(normaliseGuestMixHeader_(name));
    if (column !== undefined) return column;
  }
  return undefined;
}

function normaliseGuestMixHeader_(value) {
  return String(value || '').trim().toLowerCase().replace(/[\s_/-]+/g, '');
}

function guestMixJson_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
