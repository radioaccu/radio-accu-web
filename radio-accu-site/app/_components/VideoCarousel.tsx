"use client";

import { useRef } from "react";
import type { ArchiveVideo } from "../_lib/youtube";
import { VideoCard } from "./VideoCard";

export function VideoCarousel({ videos }: { videos: ArchiveVideo[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const move = (direction: -1 | 1) => {
    trackRef.current?.scrollBy({
      behavior: "smooth",
      left: direction * Math.min(window.innerWidth * 0.82, 520),
    });
  };

  return (
    <div className="video-carousel">
      <div className="video-carousel-controls" aria-label="Previous broadcast controls">
        <span>{String(videos.length).padStart(2, "0")} recent transmissions</span>
        <div>
          <button aria-label="Show earlier broadcasts" onClick={() => move(-1)} type="button">←</button>
          <button aria-label="Show later broadcasts" onClick={() => move(1)} type="button">→</button>
        </div>
      </div>
      <div className="video-carousel-track" ref={trackRef}>
        {videos.map((video) => <VideoCard key={video.id} video={video} />)}
      </div>
    </div>
  );
}
