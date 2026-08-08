import Link from "next/link";
import type { ArchiveVideo } from "../_lib/youtube";
import { YouTubeThumbnail } from "./YouTubeThumbnail";

export function VideoCard({
  video,
  featured = false,
  square = false,
}: {
  video: ArchiveVideo;
  featured?: boolean;
  square?: boolean;
}) {
  return (
    <Link
      className={`video-card${featured ? " featured" : ""}${square ? " square" : ""}`}
      href={`/archive/watch/${video.id}`}
    >
      <div className="video-thumbnail">
        <YouTubeThumbnail
          alt={`${video.title} at Radio ACCU`}
          sizes={square ? "(max-width: 800px) 76vw, 22vw" : featured ? "(max-width: 800px) 100vw, 66vw" : "(max-width: 800px) 82vw, 33vw"}
          videoId={video.id}
        />
        <span className="video-code">Archive / Video</span>
        <span className="video-play" aria-hidden="true">▶</span>
        <time>{video.duration}</time>
      </div>
      <div className="video-info">
        <div>
          <span>Recorded transmission</span>
          <h2>{video.title}</h2>
        </div>
        <p>{video.date}</p>
        <b aria-hidden="true">↗</b>
      </div>
    </Link>
  );
}
