import {
  downloadDropboxFile,
  getDropboxResidentAsset,
  isDropboxConfigured,
} from "../../../../_lib/dropbox";

const SAFE_SEGMENT = /^[a-z0-9][a-z0-9-]*$/;
const SAFE_ASSET = /^(image|video)-\d+$/;

function getContentType(path: string) {
  if (/\.png$/i.test(path)) return "image/png";
  if (/\.webp$/i.test(path)) return "image/webp";
  if (/\.jpe?g$/i.test(path)) return "image/jpeg";
  if (/\.mp4$/i.test(path)) return "video/mp4";
  if (/\.mov$/i.test(path)) return "video/quicktime";
  if (/\.m4v$/i.test(path)) return "video/x-m4v";
  if (/\.webm$/i.test(path)) return "video/webm";
  return "application/octet-stream";
}

export async function GET(
  request: Request,
  context: { params: Promise<{ assetId: string; slug: string }> },
) {
  const { assetId, slug } = await context.params;

  if (
    !SAFE_SEGMENT.test(slug) ||
    !SAFE_ASSET.test(assetId) ||
    !isDropboxConfigured()
  ) {
    return new Response("Resident media not found.", { status: 404 });
  }

  const asset = await getDropboxResidentAsset(slug, assetId);
  if (!asset) {
    return new Response("Resident media not found.", { status: 404 });
  }

  const dropboxResponse = await downloadDropboxFile(
    asset.path,
    request.headers.get("range"),
  );
  if (!dropboxResponse?.body) {
    return new Response("Resident media not found.", { status: 404 });
  }

  const headers = new Headers({
    "Accept-Ranges": dropboxResponse.headers.get("accept-ranges") || "bytes",
    "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
    "Content-Type": getContentType(asset.path),
  });

  for (const name of ["content-length", "content-range"]) {
    const value = dropboxResponse.headers.get(name);
    if (value) headers.set(name, value);
  }

  return new Response(dropboxResponse.body, {
    headers,
    status: dropboxResponse.status,
  });
}
