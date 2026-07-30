import { downloadDropboxFile, isDropboxConfigured } from "../../../../_lib/dropbox";

const SAFE_SEGMENT = /^[a-z0-9][a-z0-9-]*$/;
const SAFE_FILES = new Set(["profile.jpg", "profile.png", "profile.webp", "cover.jpg", "cover.png", "cover.webp"]);

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string; file: string }> },
) {
  const { slug, file } = await context.params;

  if (!SAFE_SEGMENT.test(slug) || !SAFE_FILES.has(file) || !isDropboxConfigured()) {
    return new Response("Resident image not found.", { status: 404 });
  }

  const root = (process.env.DROPBOX_RESIDENTS_ROOT || "/ACCU/Residents")
    .replace(/\/+$/, "");
  const dropboxResponse = await downloadDropboxFile(`${root}/${slug}/${file}`);

  if (!dropboxResponse?.body) {
    return new Response("Resident image not found.", { status: 404 });
  }

  return new Response(dropboxResponse.body, {
    headers: {
      "Content-Type": dropboxResponse.headers.get("content-type") || "image/jpeg",
      "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
