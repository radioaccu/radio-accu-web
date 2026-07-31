import {
  downloadDropboxFile,
  getDropboxResidentImagePath,
  isDropboxConfigured,
} from "../../../_lib/dropbox";

const SAFE_SEGMENT = /^[a-z0-9][a-z0-9-]*$/;

function getImageContentType(path: string) {
  if (/\.png$/i.test(path)) return "image/png";
  if (/\.webp$/i.test(path)) return "image/webp";
  return "image/jpeg";
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;

  if (!SAFE_SEGMENT.test(slug) || !isDropboxConfigured()) {
    return new Response("Resident image not found.", { status: 404 });
  }

  const imagePath = await getDropboxResidentImagePath(slug);
  if (!imagePath) {
    return new Response("Resident image not found.", { status: 404 });
  }

  const dropboxResponse = await downloadDropboxFile(imagePath);
  if (!dropboxResponse?.body) {
    return new Response("Resident image not found.", { status: 404 });
  }

  return new Response(dropboxResponse.body, {
    headers: {
      "Content-Type": getImageContentType(imagePath),
      "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
