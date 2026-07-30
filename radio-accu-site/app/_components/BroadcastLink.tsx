"use client";

import { useEffect, useState, type ReactNode } from "react";
import { audioFallbacks, MIXCLOUD_LIVE_URL, schedule } from "../_data/site";

export function BroadcastLink({
  className,
  children,
  ariaLabel,
}: {
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  const [broadcast, setBroadcast] = useState({
    isLive: false,
    href: audioFallbacks[0] as string,
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const now = Date.now();
      const isLive = schedule.some((show) => (
        now >= new Date(show.startsAt).getTime() &&
        now < new Date(show.endsAt).getTime()
      ));
      const randomIndex = Math.floor(Math.random() * audioFallbacks.length);

      setBroadcast({
        isLive,
        href: isLive ? MIXCLOUD_LIVE_URL : audioFallbacks[randomIndex],
      });
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const label = ariaLabel ?? (
    broadcast.isLive
      ? "Open the Radio ACCU livestream"
      : "No live broadcast — play a random previous audio broadcast"
  );

  return (
    <a
      aria-label={label}
      className={className}
      data-broadcast-state={broadcast.isLive ? "live" : "archive"}
      href={broadcast.href}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
}
