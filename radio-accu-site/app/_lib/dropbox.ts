import "server-only";

type DropboxTokenResponse = {
  access_token?: string;
};

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

export async function downloadDropboxFile(path: string) {
  const accessToken = await getDropboxAccessToken();
  if (!accessToken) return null;

  const response = await fetch("https://content.dropboxapi.com/2/files/download", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Dropbox-API-Arg": JSON.stringify({ path }),
    },
    cache: "no-store",
  });

  return response.ok ? response : null;
}
