import "server-only";

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

let residentCache: {
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

function imageScore(entry: DropboxEntry, residentFolder: string) {
  const name = entry.name.toLowerCase();
  const relativePath = entry.path_display.slice(residentFolder.length + 1);
  let score = relativePath.includes("/") ? 0 : 12;

  if (/(press|profile|portrait|headshot|photo|pic)/.test(name)) score += 25;
  if (/\.(jpg|jpeg)$/i.test(name)) score += 5;
  if (/(logo|gig|poster|flyer|artwork)/.test(name)) score -= 30;

  return score;
}

export async function getDropboxResidents() {
  if (!isDropboxConfigured()) return [];
  if (residentCache && residentCache.expiresAt > Date.now()) {
    return residentCache.residents;
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
    expiresAt: Date.now() + 5 * 60_000,
    residents,
  };

  return residents;
}

export async function getDropboxResidentImagePath(slug: string) {
  const residents = await getDropboxResidents();
  return residents.find((resident) => resident.slug === slug)?.imagePath ?? null;
}

export async function downloadDropboxFile(path: string) {
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
    },
    cache: "no-store",
  });

  return response.ok ? response : null;
}
