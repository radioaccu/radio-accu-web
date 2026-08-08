"use client";

import Image from "next/image";
import { useState } from "react";

const thumbnailQualities = ["maxresdefault", "sddefault", "hqdefault"] as const;

export function YouTubeThumbnail({
  alt,
  sizes,
  videoId,
}: {
  alt: string;
  sizes: string;
  videoId: string;
}) {
  const [qualityIndex, setQualityIndex] = useState(0);
  const quality = thumbnailQualities[qualityIndex];

  return (
    <Image
      alt={alt}
      fill
      onError={() => {
        setQualityIndex((current) => (
          current < thumbnailQualities.length - 1 ? current + 1 : current
        ));
      }}
      sizes={sizes}
      src={`https://i.ytimg.com/vi/${videoId}/${quality}.jpg`}
      unoptimized
    />
  );
}
