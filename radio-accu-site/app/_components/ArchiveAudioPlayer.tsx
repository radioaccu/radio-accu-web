"use client";

import { useEffect, useState } from "react";
import { audioFallbacks } from "../_data/site";

function randomTrackIndex(previousIndex: number) {
  if (audioFallbacks.length < 2) return 0;

  let nextIndex = previousIndex;
  while (nextIndex === previousIndex) {
    nextIndex = Math.floor(Math.random() * audioFallbacks.length);
  }
  return nextIndex;
}

export function ArchiveAudioPlayer() {
  const [trackIndex, setTrackIndex] = useState(0);
  const track = audioFallbacks[trackIndex];
  const playerUrl = [
    "https://w.soundcloud.com/player/",
    `?url=${encodeURIComponent(track.url)}`,
    "&color=%23b9ff00",
    "&auto_play=true",
    "&hide_related=true",
    "&show_comments=false",
    "&show_user=true",
    "&show_reposts=false",
    "&visual=false",
  ].join("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setTrackIndex(Math.floor(Math.random() * audioFallbacks.length));
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="archive-audio" aria-labelledby="archive-audio-heading">
      <div className="archive-audio-status">
        <p>Grid standby / Archive relay</p>
        <span><i /> Signal available</span>
      </div>

      <div className="archive-audio-main">
        <div>
          <p>Now relaying</p>
          <h1 id="archive-audio-heading">{track.title}</h1>
        </div>
        <button
          type="button"
          onClick={() => setTrackIndex((current) => randomTrackIndex(current))}
        >
          Randomise signal ↻
        </button>
      </div>

      <div className="archive-audio-player">
        <iframe
          key={track.url}
          title={`SoundCloud player for ${track.title}`}
          width="100%"
          height="166"
          scrolling="no"
          allow="autoplay"
          src={playerUrl}
        />
      </div>
    </section>
  );
}
