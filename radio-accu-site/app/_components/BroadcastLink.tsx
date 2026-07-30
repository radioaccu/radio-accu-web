"use client";

import { useEffect, useState, type ReactNode } from "react";
import { MIXCLOUD_LIVE_URL, type ScheduleShow } from "../_data/site";

async function loadSchedule() {
  const response = await fetch("/api/schedule", { cache: "no-store" });
  if (!response.ok) return [];
  return response.json() as Promise<ScheduleShow[]>;
}

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
    href: "/listen",
  });

  useEffect(() => {
    let cancelled = false;
    let currentSchedule: ScheduleShow[] = [];

    const updateBroadcastState = () => {
      const now = Date.now();
      const isLive = currentSchedule.some((show) => (
        now >= new Date(show.startsAt).getTime() &&
        now < new Date(show.endsAt).getTime()
      ));

      if (!cancelled) {
        setBroadcast({
          isLive,
          href: isLive ? MIXCLOUD_LIVE_URL : "/listen",
        });
      }
    };

    const refreshSchedule = async () => {
      try {
        currentSchedule = await loadSchedule();
      } finally {
        updateBroadcastState();
      }
    };

    void refreshSchedule();
    const stateTimer = window.setInterval(updateBroadcastState, 30_000);
    const scheduleTimer = window.setInterval(refreshSchedule, 5 * 60_000);

    return () => {
      cancelled = true;
      window.clearInterval(stateTimer);
      window.clearInterval(scheduleTimer);
    };
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
      target={broadcast.isLive ? "_blank" : undefined}
      rel={broadcast.isLive ? "noreferrer" : undefined}
    >
      {children}
    </a>
  );
}
