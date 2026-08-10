import "server-only";

const PUBLIC_STATUSES = new Set(["published", "released", "live"]);

export type PublicGuestMix = {
  code: string;
  artist: string;
  releaseDate: string;
  country: string;
  duration: string;
  artworkUrl: string;
  soundcloudUrl: string;
  youtubeUrl: string;
  bio: string;
};

function parseCsv(csv: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];
    const next = csv[index + 1];

    if (character === '"') {
      if (quoted && next === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      row.push(value.trim());
      value = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && next === "\n") index += 1;
      row.push(value.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      value = "";
    } else {
      value += character;
    }
  }

  row.push(value.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

function normaliseHeader(value: string) {
  return value.trim().toLowerCase().replace(/[\s_-]+/g, "");
}

function cell(row: string[], headers: Map<string, number>, names: string[]) {
  for (const name of names) {
    const index = headers.get(normaliseHeader(name));
    if (index !== undefined) return row[index]?.trim() ?? "";
  }
  return "";
}

function publicUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : "";
  } catch {
    return "";
  }
}

function rowsToGuestMixes(csv: string): PublicGuestMix[] {
  const [headerRow, ...dataRows] = parseCsv(csv);
  if (!headerRow) return [];

  const headers = new Map(
    headerRow.map((header, index) => [normaliseHeader(header), index]),
  );

  return dataRows.flatMap((row, index) => {
    const artist = cell(row, headers, ["artist", "artist name", "artist / dj name"]);
    const status = cell(row, headers, ["status", "release status"]);
    if (!artist || !PUBLIC_STATUSES.has(status.toLowerCase())) return [];

    return [{
      code: cell(row, headers, ["code", "gm code", "guest mix number"]) ||
        `GM-${String(index + 1).padStart(3, "0")}`,
      artist,
      releaseDate: cell(row, headers, ["release date", "published date"]),
      country: cell(row, headers, ["country", "location"]),
      duration: cell(row, headers, ["duration", "mix length"]) || "60 min",
      artworkUrl: publicUrl(cell(row, headers, ["artwork url", "artwork link"])),
      soundcloudUrl: publicUrl(cell(row, headers, ["soundcloud url", "soundcloud link"])),
      youtubeUrl: publicUrl(cell(row, headers, ["youtube url", "youtube link"])),
      bio: cell(row, headers, ["bio", "biography", "short bio"]),
    }];
  });
}

export async function getPublishedGuestMixes() {
  const csvUrl = process.env.GOOGLE_SHEET_GM_CSV_URL;
  if (!csvUrl) return [];

  try {
    const response = await fetch(csvUrl, { next: { revalidate: 300 } });
    if (!response.ok) throw new Error(`Google Sheets returned ${response.status}`);
    return rowsToGuestMixes(await response.text());
  } catch (error) {
    console.error("Could not refresh the public ACCU Guest Mix feed.", error);
    return [];
  }
}
