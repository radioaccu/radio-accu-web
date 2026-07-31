import "server-only";
import { strFromU8, unzipSync } from "fflate";

type DropboxTokenResponse = {
  access_token?: string;
};

type DropboxEntry = {
  ".tag": "file" | "folder";
  name: string;
  path_display: string;
  path_lower: string;
};

type DropboxListResponse = {
  entries?: DropboxEntry[];
  cursor?: string;
  has_more?: boolean;
};

export type DropboxResident = {
  slug: string;
  name: string;
  imagePath: string | null;
};

export type DropboxResidentAsset = {
  id: string;
  kind: "image" | "video" | "document";
  name: string;
  path: string;
};

export type DropboxResidentDetail = DropboxResident & {
  bio: string | null;
  documents: DropboxResidentAsset[];
  photos: DropboxResidentAsset[];
  videos: DropboxResidentAsset[];
};

let residentCache: {
  entries: DropboxEntry[];
  expiresAt: number;
  residents: DropboxResident[];
} | null = null;

export function isDropboxConfigured() {
  return Boolean(process.env.DROPBOX_ACCESS_TOKEN || (
    process.env.DROPBOX_APP_KEY &&
    process.env.DROPBOX_APP_SECRET &&
    process.env.DROPBOX_REFRESH_TOKEN
  ));
}

async function getDropboxAccessToken() {
  if (process.env.DROPBOX_ACCESS_TOKEN) {
    return process.env.DROPBOX_ACCESS_TOKEN;
  }

  const appKey = process.env.DROPBOX_APP_KEY;
  const appSecret = process.env.DROPBOX_APP_SECRET;
  const refreshToken = process.env.DROPBOX_REFRESH_TOKEN;

  if (!appKey || !appSecret || !refreshToken) return null;

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: appKey,
    client_secret: appSecret,
  });

  const response = await fetch("https://api.dropboxapi.com/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  if (!response.ok) return null;
  const payload = await response.json() as DropboxTokenResponse;
  return payload.access_token ?? null;
}

async function callDropboxApi<T>(endpoint: string, payload: object) {
  const accessToken = await getDropboxAccessToken();
  if (!accessToken) return null;

  const response = await fetch(`https://api.dropboxapi.com/2/${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  return response.ok ? response.json() as Promise<T> : null;
}

async function listDropboxEntries(path: string) {
  const entries: DropboxEntry[] = [];
  let page = await callDropboxApi<DropboxListResponse>("files/list_folder", {
    path,
    recursive: true,
    limit: 2000,
  });

  while (page) {
    entries.push(...(page.entries ?? []));
    if (!page.has_more || !page.cursor) break;

    page = await callDropboxApi<DropboxListResponse>("files/list_folder/continue", {
      cursor: page.cursor,
    });
  }

  return entries;
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const preferredResidentImages: Record<string, RegExp> = {
  maraschino: /^Maraschino .* 02\.jpe?g$/i,
  savan: /^IMG_4117\.jpe?g$/i,
};

function imageScore(entry: DropboxEntry, residentFolder: string) {
  const name = entry.name.toLowerCase();
  const relativePath = entry.path_display.slice(residentFolder.length + 1);
  const residentSlug = slugify(residentFolder.split("/").at(-1) ?? "");
  let score = relativePath.includes("/") ? 0 : 12;

  if (preferredResidentImages[residentSlug]?.test(entry.name)) score += 1000;
  if (/(press|profile|portrait|headshot|photo|pic)/.test(name)) score += 25;
  if (/\.(jpg|jpeg)$/i.test(name)) score += 5;
  if (/(logo|gig|poster|flyer|artwork)/.test(name)) score -= 30;

  return score;
}

async function getDropboxSnapshot() {
  if (!isDropboxConfigured()) return { entries: [], residents: [] };
  if (residentCache && residentCache.expiresAt > Date.now()) {
    return residentCache;
  }

  const root = (process.env.DROPBOX_RESIDENTS_ROOT || "/RADIO ACCU RESIDENTS")
    .replace(/\/+$/, "");
  const entries = await listDropboxEntries(root);
  const rootPrefix = `${root.toLowerCase()}/`;
  const folders = entries.filter((entry) => {
    if (entry[".tag"] !== "folder") return false;
    const relativePath = entry.path_lower.startsWith(rootPrefix)
      ? entry.path_lower.slice(rootPrefix.length)
      : "";
    return Boolean(relativePath) && !relativePath.includes("/");
  });

  const residents = folders.map((folder) => {
    const folderPrefix = `${folder.path_lower}/`;
    const images = entries
      .filter((entry) => (
        entry[".tag"] === "file" &&
        entry.path_lower.startsWith(folderPrefix) &&
        /\.(jpg|jpeg|png|webp)$/i.test(entry.name)
      ))
      .sort((first, second) => (
        imageScore(second, folder.path_display) - imageScore(first, folder.path_display)
      ));

    return {
      slug: slugify(folder.name),
      name: folder.name,
      imagePath: images[0]?.path_display ?? null,
    };
  }).sort((first, second) => first.name.localeCompare(second.name, "en"));

  residentCache = {
    entries,
    expiresAt: Date.now() + 5 * 60_000,
    residents,
  };

  return residentCache;
}

export async function getDropboxResidents() {
  return (await getDropboxSnapshot()).residents;
}

export async function getDropboxResidentImagePath(slug: string) {
  const residents = await getDropboxResidents();
  return residents.find((resident) => resident.slug === slug)?.imagePath ?? null;
}

function buildAssets(entries: DropboxEntry[], pattern: RegExp, kind: DropboxResidentAsset["kind"]) {
  return entries
    .filter((entry) => entry[".tag"] === "file" && pattern.test(entry.name))
    .sort((first, second) => first.path_display.localeCompare(second.path_display, "en"))
    .map((entry, index) => ({
      id: `${kind}-${index}`,
      kind,
      name: entry.name,
      path: entry.path_display,
    }));
}

function decodeXmlEntities(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&apos;/g, "'");
}

async function readResidentBio(entries: DropboxEntry[]) {
  const bioFile = entries.find((entry) => (
    entry[".tag"] === "file" &&
    /(^|\/|[\s_-])bio([\s_.-]|$)/i.test(entry.path_display) &&
    /\.(docx|txt|md)$/i.test(entry.name)
  ));
  if (!bioFile) return null;

  const response = await downloadDropboxFile(bioFile.path_display);
  if (!response?.ok) return null;

  if (/\.(txt|md)$/i.test(bioFile.name)) {
    return (await response.text()).trim() || null;
  }

  try {
    const archive = unzipSync(new Uint8Array(await response.arrayBuffer()));
    const documentXml = archive["word/document.xml"];
    if (!documentXml) return null;

    const bio = strFromU8(documentXml)
      .replace(/<w:tab\b[^>]*\/>/g, "\t")
      .replace(/<w:br\b[^>]*\/>/g, "\n")
      .replace(/<\/w:p>/g, "\n\n")
      .replace(/<[^>]+>/g, "")
      .split("\n")
      .map((line) => decodeXmlEntities(line).trim())
      .filter(Boolean)
      .join("\n\n");

    return bio || null;
  } catch {
    return null;
  }
}

export async function getDropboxResidentDetail(slug: string) {
  const snapshot = await getDropboxSnapshot();
  const resident = snapshot.residents.find((item) => item.slug === slug);
  if (!resident) return null;

  const root = (process.env.DROPBOX_RESIDENTS_ROOT || "/RADIO ACCU RESIDENTS")
    .replace(/\/+$/, "");
  const folder = snapshot.entries.find((entry) => (
    entry[".tag"] === "folder" &&
    slugify(entry.name) === slug &&
    entry.path_lower.split("/").filter(Boolean).length ===
      root.split("/").filter(Boolean).length + 1
  ));
  if (!folder) return null;

  const folderPrefix = `${folder.path_lower}/`;
  const files = snapshot.entries.filter((entry) => (
    entry[".tag"] === "file" && entry.path_lower.startsWith(folderPrefix)
  ));
  const photos = buildAssets(files, /\.(jpg|jpeg|png|webp)$/i, "image");
  const videos = buildAssets(files, /\.(mp4|mov|m4v|webm)$/i, "video");
  const documents = buildAssets(files, /\.(pdf|docx|txt|md)$/i, "document");

  return {
    ...resident,
    bio: await readResidentBio(files),
    documents,
    photos,
    videos,
  } satisfies DropboxResidentDetail;
}

export async function getDropboxResidentAsset(slug: string, assetId: string) {
  const resident = await getDropboxResidentDetail(slug);
  if (!resident) return null;

  return [...resident.photos, ...resident.videos]
    .find((asset) => asset.id === assetId) ?? null;
}

export async function downloadDropboxFile(path: string, range?: string | null) {
  const accessToken = await getDropboxAccessToken();
  if (!accessToken) return null;

  const dropboxArgument = JSON.stringify({ path }).replace(
    /[\u007f-\uffff]/g,
    (character) => `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`,
  );

  const response = await fetch("https://content.dropboxapi.com/2/files/download", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Dropbox-API-Arg": dropboxArgument,
      ...(range ? { Range: range } : {}),
    },
    cache: "no-store",
  });

  return response.ok ? response : null;
}
