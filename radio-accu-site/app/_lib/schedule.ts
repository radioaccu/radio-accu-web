import "server-only";

import { schedule as fallbackSchedule, type ScheduleShow } from "../_data/site";

const PUBLIC_STATUSES = new Set(["confirmed", "published", "live"]);
const BRUSSELS_TIME_ZONE = "Europe/Brussels";
const DEFAULT_PUBLIC_SCHEDULE_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQjKGlFmftVAMgOerhNBdG2EOvUAADB9nxL2KCChZY0Uo4uBBE9lGrCg3XnpFijV1vfV78PtLvl13-a/pub?gid=1031435176&single=true&output=csv";

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

function normaliseHeaderRow(row: string[]) {
  const populatedCells = row.filter(Boolean);

  if (populatedCells.length === 1 && populatedCells[0].includes("|")) {
    return populatedCells[0].split("|").map((header) => header.trim());
  }

  return row;
}

function findCell(
  row: string[],
  headers: Map<string, number>,
  names: string[],
) {
  for (const name of names) {
    const index = headers.get(normaliseHeader(name));
    if (index !== undefined) return row[index]?.trim() ?? "";
  }
  return "";
}

function normaliseDate(value: string) {
  const isoMatch = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  const europeanMatch = value.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
  if (europeanMatch) {
    const [, day, month, year] = europeanMatch;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;

  return [
    parsed.getUTCFullYear(),
    String(parsed.getUTCMonth() + 1).padStart(2, "0"),
    String(parsed.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

function normaliseTime(value: string) {
  const match = value.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return null;

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return null;

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function addDays(date: string, days: number) {
  const parsed = new Date(`${date}T12:00:00Z`);
  parsed.setUTCDate(parsed.getUTCDate() + days);
  return parsed.toISOString().slice(0, 10);
}

function brusselsOffset(date: string) {
  const offsetPart = new Intl.DateTimeFormat("en-US", {
    timeZone: BRUSSELS_TIME_ZONE,
    timeZoneName: "longOffset",
  }).formatToParts(new Date(`${date}T12:00:00Z`))
    .find((part) => part.type === "timeZoneName")?.value;

  return offsetPart?.replace("GMT", "") || "+01:00";
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}

function publicArtistName(value: string) {
  const cleaned = value
    .replace(/^.*\binvites?\s*(?:[/:–—-]\s*)?/i, "")
    .replace(/^residentie(?:\s*\/\s*|\s+)/i, "")
    .trim();

  return cleaned || value.trim();
}

function isPrivateScheduleLabel(value: string) {
  const normalised = value.trim().toLowerCase();
  return (
    normalised.includes("geen uitzending") ||
    /^(optie|option)\s*:/.test(normalised) ||
    /^(tba|tbc)$/.test(normalised)
  );
}

function rowsToSchedule(csv: string): ScheduleShow[] {
  const rows = parseCsv(csv);
  const [sourceHeaderRow, ...dataRows] = rows;
  if (!sourceHeaderRow) return [];
  const headerRow = normaliseHeaderRow(sourceHeaderRow);

  const headers = new Map(
    headerRow.map((header, index) => [normaliseHeader(header), index]),
  );

  return dataRows.flatMap((row) => {
    const date = normaliseDate(findCell(row, headers, ["Date", "Datum"]));
    const start = normaliseTime(findCell(row, headers, ["Start", "Start Time", "Starttijd"]));
    const end = normaliseTime(findCell(row, headers, ["End", "End Time", "Eindtijd"]));
    const sourceArtist = findCell(row, headers, ["Artist", "Artiest", "Name", "Naam"]);
    const artist = publicArtistName(sourceArtist);
    const status = findCell(row, headers, ["Status"]) || "Confirmed";

    if (!date || !start || !end || !artist) return [];
    if (isPrivateScheduleLabel(sourceArtist)) return [];
    if (!PUBLIC_STATUSES.has(status.toLowerCase())) return [];

    const endDate = end <= start ? addDays(date, 1) : date;
    const startsAt = `${date}T${start}:00${brusselsOffset(date)}`;
    const endsAt = `${endDate}T${end}:00${brusselsOffset(endDate)}`;

    return [{
      date: formatDate(date),
      time: `${start} — ${end}`,
      artist,
      status,
      startsAt,
      endsAt,
    }];
  }).sort((first, second) => (
    new Date(first.startsAt).getTime() - new Date(second.startsAt).getTime()
  ));
}

export async function getSchedule(): Promise<ScheduleShow[]> {
  const csvUrl = process.env.GOOGLE_SHEET_SCHEDULE_CSV_URL ||
    DEFAULT_PUBLIC_SCHEDULE_CSV_URL;

  try {
    const response = await fetch(csvUrl, { next: { revalidate: 300 } });
    if (!response.ok) throw new Error(`Google Sheets returned ${response.status}`);

    const parsedSchedule = rowsToSchedule(await response.text());
    return parsedSchedule.length > 0 ? parsedSchedule : fallbackSchedule;
  } catch (error) {
    console.error("Could not refresh the ACCU schedule.", error);
    return fallbackSchedule;
  }
}

export async function getUpcomingSchedule(limit?: number) {
  const schedule = await getSchedule();
  const now = Date.now();
  const upcoming = schedule.filter((show) => new Date(show.endsAt).getTime() >= now);
  return typeof limit === "number" ? upcoming.slice(0, limit) : upcoming;
}

function getBrusselsMonthKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    month: "2-digit",
    timeZone: BRUSSELS_TIME_ZONE,
    year: "numeric",
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;

  return year && month ? `${year}-${month}` : date.toISOString().slice(0, 7);
}

export async function getCurrentMonthSchedule() {
  const schedule = await getSchedule();
  const currentMonth = getBrusselsMonthKey();

  return schedule.filter((show) => show.startsAt.slice(0, 7) === currentMonth);
}
