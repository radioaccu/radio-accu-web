import Image from "next/image";
import type { videos } from "../_data/site";

type Video = (typeof videos)[number];

export function VideoCard({ video, featured = false }: { video: Video; featured?: boolean }) {
  return (
    <a
      className={`video-card${featured ? " featured" : ""}`}
      href={`https://www.youtube.com/watch?v=${video.id}`}
      target="_blank"
      rel="noreferrer"
    >
      <div className="video-thumbnail">
        <Image
          src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
          alt={`${video.title} at Radio ACCU`}
          fill
          sizes={featured ? "(max-width: 800px) 100vw, 66vw" : "(max-width: 800px) 82vw, 33vw"}
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
    </a>
  );
}
