"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const DROPBOX_REFRESH_INTERVAL = 60_000;

export function DropboxAutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    const refresh = () => router.refresh();
    const interval = window.setInterval(refresh, DROPBOX_REFRESH_INTERVAL);

    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };

    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [router]);

  return null;
}
