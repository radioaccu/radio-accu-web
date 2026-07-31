import "server-only";

export const YOUTUBE_CHANNEL_ID = "UCxe78QV-vQutFLjYA6d7g8w";
export const YOUTUBE_UPLOADS_PLAYLIST = "UUxe78QV-vQutFLjYA6d7g8w";

export type ArchiveVideo = {
  date: string;
  duration: string;
  id: string;
  publishedAt?: string;
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
          publishedAt: published,
          title: decodeXml(readTag(entry, "title")),
        };
      })
      .filter((video) => /^[a-zA-Z0-9_-]{11}$/.test(video.id));
  } catch {
    return [];
  }
}

function videoDate(video: ArchiveVideo) {
  if (video.publishedAt) {
    const date = new Date(video.publishedAt);
    if (!Number.isNaN(date.getTime())) return date;
  }

  const date = new Date(`${video.date} 12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function getPreviousBroadcastWeek(
  videos: ArchiveVideo[],
  currentTransmission?: string,
) {
  const transmissionDate = currentTransmission
    ? new Date(currentTransmission)
    : new Date();

  if (Number.isNaN(transmissionDate.getTime())) return videos.slice(0, 4);

  const end = new Date(transmissionDate);
  end.setHours(0, 0, 0, 0);

  const start = new Date(end);
  start.setDate(start.getDate() - 7);

  const previousWeek = videos.filter((video) => {
    const date = videoDate(video);
    return date ? date >= start && date < end : false;
  });

  if (previousWeek.length > 0) return previousWeek.slice(0, 4);

  const earlierVideos = videos.filter((video) => {
    const date = videoDate(video);
    return date ? date < end : false;
  });

  return (earlierVideos.length > 0 ? earlierVideos : videos).slice(0, 4);
}
