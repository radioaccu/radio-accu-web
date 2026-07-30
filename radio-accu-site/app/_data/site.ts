export const MIXCLOUD_LIVE_URL = "https://www.mixcloud.com/live/radioaccu";
export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@radioaccu";

export const navigation = [
  { number: "01", label: "Transmission", href: "/", key: "home" },
  { number: "02", label: "Schedule", href: "/schedule", key: "schedule" },
  { number: "03", label: "Archive", href: "/archive", key: "archive" },
  { number: "04", label: "Residents", href: "/residents", key: "residents" },
  { number: "05", label: "GM Series", href: "/gm-series", key: "gm" },
  { number: "06", label: "About", href: "/about", key: "about" },
] as const;

export const schedule = [
  {
    date: "02 Aug 2026",
    time: "14:00 — 16:00",
    artist: "Vincent Neumann",
    status: "Confirmed",
    startsAt: "2026-08-02T14:00:00+02:00",
    endsAt: "2026-08-02T16:00:00+02:00",
  },
  {
    date: "09 Aug 2026",
    time: "14:00 — 16:00",
    artist: "Bashti",
    status: "Confirmed",
    startsAt: "2026-08-09T14:00:00+02:00",
    endsAt: "2026-08-09T16:00:00+02:00",
  },
  {
    date: "16 Aug 2026",
    time: "14:00 — 16:00",
    artist: "Sohirab",
    status: "Confirmed",
    startsAt: "2026-08-16T14:00:00+02:00",
    endsAt: "2026-08-16T16:00:00+02:00",
  },
  {
    date: "23 Aug 2026",
    time: "14:00 — 16:00",
    artist: "Aura B2B Isha",
    status: "Confirmed",
    startsAt: "2026-08-23T14:00:00+02:00",
    endsAt: "2026-08-23T16:00:00+02:00",
  },
] as const;

export const audioFallbacks = [
  "https://soundcloud.com/radioaccu/reese-radio-accu-26-july-2026",
  "https://soundcloud.com/radioaccu/a-dumont-radio-accu-26-july",
  "https://soundcloud.com/radioaccu/digity-radio-accu-26-july-2026",
  "https://soundcloud.com/radioaccu/yung-michele-radio-accu-26",
  "https://soundcloud.com/radioaccu/savan-radio-accu-19-july-2026",
  "https://soundcloud.com/radioaccu/fatoem4n-radio-accu-19-july",
  "https://soundcloud.com/radioaccu/hayai-radio-accu-19-july-2026",
  "https://soundcloud.com/radioaccu/faio-radio-accu-19-july-2026",
] as const;

export const videos = [
  {
    id: "wHwRsraQAqs",
    title: "Digity",
    date: "26 July 2026",
    duration: "1:04:08",
  },
  {
    id: "6CNLP8NtU3A",
    title: "A. Dumont",
    date: "26 July 2026",
    duration: "1:00:11",
  },
  {
    id: "k-8mMk-UMRU",
    title: "Reese",
    date: "26 July 2026",
    duration: "1:02:24",
  },
  {
    id: "vvfxo24GzYc",
    title: "Yung Michele",
    date: "26 July 2026",
    duration: "1:02:28",
  },
  {
    id: "zIPI0S0wBX8",
    title: "Savan",
    date: "19 July 2026",
    duration: "1:03:47",
  },
  {
    id: "0n4WTmM-nkE",
    title: "Fatoem4n",
    date: "19 July 2026",
    duration: "1:01:51",
  },
  {
    id: "6zZPpQcytzY",
    title: "Hayai",
    date: "19 July 2026",
    duration: "1:01:43",
  },
  {
    id: "FzL9BOqif7Q",
    title: "FAIO",
    date: "19 July 2026",
    duration: "1:00:42",
  },
] as const;

export const residents = [
  { code: "NODE-001", name: "Vincent Neumann", genre: "Electronic / Techno", crop: "crop-a" },
  { code: "NODE-002", name: "Bashti", genre: "Bass / Leftfield", crop: "crop-b" },
  { code: "NODE-003", name: "Aura", genre: "House / Electro", crop: "crop-c" },
  { code: "NODE-004", name: "Sohirab", genre: "Techno / Experimental", crop: "crop-d" },
] as const;

export const guestMixes = [
  { code: "GM-014", artist: "Philou Louzolo", location: "Belgium", duration: "60 min", crop: "crop-b" },
  { code: "GM-013", artist: "Joanna OJ", location: "Belgium", duration: "60 min", crop: "crop-a" },
  { code: "GM-012", artist: "Ecilo", location: "Belgium", duration: "61 min", crop: "crop-c" },
  { code: "GM-011", artist: "Skele Tale", location: "Belgium", duration: "50 min", crop: "crop-d" },
] as const;
