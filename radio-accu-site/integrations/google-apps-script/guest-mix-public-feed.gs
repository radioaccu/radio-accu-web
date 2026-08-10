/**
 * Radio ACCU — safe Guest Mix website feed
 *
 * Install this in the Apps Script project attached to ACCU HQ.
 * The script copies only approved public fields from "Guest Mixes" to
 * "Website GM". E-mail addresses, private download links and permissions
 * never enter the public tab.
 */

const ACCU_GM_FEED = {
  SOURCE_SHEET: 'Guest Mixes',
  PUBLIC_SHEET: 'Website GM',
  PUBLIC_STATUSES: ['published', 'released', 'live'],
  HEADERS: [
    'code',
    'artist',
    'release_date',
    'country',
    'duration',
    'artwork_url',
    'soundcloud_url',
    'youtube_url',
    'status',
    'bio',
  ],
};

function setupAccuGuestMixPublicFeed() {
  const spreadsheet = SpreadsheetApp.getActive();
  let publicSheet = spreadsheet.getSheetByName(ACCU_GM_FEED.PUBLIC_SHEET);

  if (!publicSheet) {
    publicSheet = spreadsheet.insertSheet(ACCU_GM_FEED.PUBLIC_SHEET);
  }

  ScriptApp.getProjectTriggers()
    .filter((trigger) => trigger.getHandlerFunction() === 'syncAccuGuestMixPublicFeed')
    .forEach((trigger) => ScriptApp.deleteTrigger(trigger));

  ScriptApp.newTrigger('syncAccuGuestMixPublicFeed')
    .forSpreadsheet(spreadsheet)
    .onEdit()
    .create();

  ScriptApp.newTrigger('syncAccuGuestMixPublicFeed')
    .timeBased()
    .everyMinutes(5)
    .create();

  syncAccuGuestMixPublicFeed();
}

function syncAccuGuestMixPublicFeed() {
  const spreadsheet = SpreadsheetApp.getActive();
  const sourceSheet = spreadsheet.getSheetByName(ACCU_GM_FEED.SOURCE_SHEET);
  const publicSheet = spreadsheet.getSheetByName(ACCU_GM_FEED.PUBLIC_SHEET);

  if (!sourceSheet) {
    throw new Error('Sheet "' + ACCU_GM_FEED.SOURCE_SHEET + '" was not found.');
  }
  if (!publicSheet) {
    throw new Error('Run setupAccuGuestMixPublicFeed once before syncing.');
  }

  const values = sourceSheet.getDataRange().getDisplayValues();
  const sourceHeaders = values.shift() || [];
  const headerMap = new Map(
    sourceHeaders.map((header, index) => [normaliseAccuHeader_(header), index]),
  );

  const publicRows = values.flatMap((row) => {
    const status = accuCell_(row, headerMap, ['Status', 'Release Status']);
    const artist = accuCell_(row, headerMap, [
      'Artist',
      'Artist Name',
      'Artist / DJ Name',
    ]);

    if (!artist || !ACCU_GM_FEED.PUBLIC_STATUSES.includes(status.toLowerCase())) {
      return [];
    }

    return [[
      accuCell_(row, headerMap, ['GM Code', 'Code', 'Guest Mix Number']),
      artist,
      accuCell_(row, headerMap, ['Release Date', 'Published Date']),
      accuCell_(row, headerMap, ['Country', 'Location']),
      accuCell_(row, headerMap, ['Duration', 'Mix Length']) || '60 min',
      accuCell_(row, headerMap, ['Artwork URL', 'Artwork Link']),
      accuCell_(row, headerMap, ['SoundCloud URL', 'SoundCloud Link']),
      accuCell_(row, headerMap, ['YouTube URL', 'YouTube Link']),
      status,
      accuCell_(row, headerMap, ['Bio', 'Biography', 'Short Bio']),
    ]];
  });

  publicSheet.clearContents();
  publicSheet.getRange(1, 1, 1, ACCU_GM_FEED.HEADERS.length)
    .setValues([ACCU_GM_FEED.HEADERS]);

  if (publicRows.length) {
    publicSheet.getRange(2, 1, publicRows.length, ACCU_GM_FEED.HEADERS.length)
      .setValues(publicRows);
  }

  publicSheet.setFrozenRows(1);
  publicSheet.autoResizeColumns(1, ACCU_GM_FEED.HEADERS.length);
}

function normaliseAccuHeader_(value) {
  return String(value || '').trim().toLowerCase().replace(/[\s_-]+/g, '');
}

function accuCell_(row, headerMap, names) {
  for (const name of names) {
    const index = headerMap.get(normaliseAccuHeader_(name));
    if (index !== undefined) return String(row[index] || '').trim();
  }
  return '';
}
