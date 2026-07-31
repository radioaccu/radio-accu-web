import "server-only";

export const YOUTUBE_CHANNEL_ID = "UCxe78QV-vQutFLjYA6d7g8w";
export const YOUTUBE_UPLOADS_PLAYLIST = "UUxe78QV-vQutFLjYA6d7g8w";

export type ArchiveVideo = {
  date: string;
  duration: string;
  id: string;
  title: string;
};

function decodeXml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;|&apos;/g, "'");
}

function readTag(entry: string, tag: string) {
  const match = entry.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
  return match?.[1]?.trim() ?? "";
}

export async function getYoutubeVideos(): Promise<ArchiveVideo[]> {
  try {
    const response = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`,
      { next: { revalidate: 1800 } },
    );
    if (!response.ok) return [];

    const xml = await response.text();
    return Array.from(xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g))
      .map((match) => {
        const entry = match[1];
        const published = readTag(entry, "published");
        const date = published
          ? new Intl.DateTimeFormat("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              timeZone: "Europe/Brussels",
            }).format(new Date(published))
          : "Radio ACCU archive";

        return {
          date,
          duration: "Full transmission",
          id: readTag(entry, "yt:videoId"),
          title: decodeXml(readTag(entry, "title")),
        };
      })
      .filter((video) => /^[a-zA-Z0-9_-]{11}$/.test(video.id));
  } catch {
    return [];
  }
}
