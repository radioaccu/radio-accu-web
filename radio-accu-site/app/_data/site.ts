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

export type ScheduleShow = {
  date: string;
  time: string;
  artist: string;
  status: string;
  startsAt: string;
  endsAt: string;
};

export const schedule: ScheduleShow[] = [
  {
    date: "02 August 2026",
    time: "14:00 — 15:00",
    artist: "Tusais",
    status: "Confirmed",
    startsAt: "2026-08-02T14:00:00+02:00",
    endsAt: "2026-08-02T15:00:00+02:00",
  },
  {
    date: "02 August 2026",
    time: "15:00 — 16:00",
    artist: "Nag",
    status: "Confirmed",
    startsAt: "2026-08-02T15:00:00+02:00",
    endsAt: "2026-08-02T16:00:00+02:00",
  },
  {
    date: "02 August 2026",
    time: "16:00 — 17:00",
    artist: "Toolbox",
    status: "Confirmed",
    startsAt: "2026-08-02T16:00:00+02:00",
    endsAt: "2026-08-02T17:00:00+02:00",
  },
  {
    date: "02 August 2026",
    time: "17:00 — 18:00",
    artist: "Mon Tubee",
    status: "Confirmed",
    startsAt: "2026-08-02T17:00:00+02:00",
    endsAt: "2026-08-02T18:00:00+02:00",
  },
] satisfies ScheduleShow[];

export const audioFallbacks = [
  { title: "Reese — Radio ACCU · 26 July 2026", url: "https://soundcloud.com/radioaccu/reese-radio-accu-26-july-2026" },
  { title: "A. Dumont — Radio ACCU · 26 July 2026", url: "https://soundcloud.com/radioaccu/a-dumont-radio-accu-26-july" },
  { title: "Digity — Radio ACCU · 26 July 2026", url: "https://soundcloud.com/radioaccu/digity-radio-accu-26-july-2026" },
  { title: "Yung Michele — Radio ACCU · 26 July 2026", url: "https://soundcloud.com/radioaccu/yung-michele-radio-accu-26" },
  { title: "Savan — Radio ACCU · 19 July 2026", url: "https://soundcloud.com/radioaccu/savan-radio-accu-19-july-2026" },
  { title: "Fatoem4n — Radio ACCU · 19 July 2026", url: "https://soundcloud.com/radioaccu/fatoem4n-radio-accu-19-july" },
  { title: "Hayai — Radio ACCU · 19 July 2026", url: "https://soundcloud.com/radioaccu/hayai-radio-accu-19-july-2026" },
  { title: "FAIO — Radio ACCU · 19 July 2026", url: "https://soundcloud.com/radioaccu/faio-radio-accu-19-july-2026" },
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
  { code: "NODE-001", name: "Vincent Neumann", genre: "Electronic / Techno", crop: "crop-a", dropboxFolder: "/ACCU/Residents/vincent-neumann" },
  { code: "NODE-002", name: "Bashti", genre: "Bass / Leftfield", crop: "crop-b", dropboxFolder: "/ACCU/Residents/bashti" },
  { code: "NODE-003", name: "Aura", genre: "House / Electro", crop: "crop-c", dropboxFolder: "/ACCU/Residents/aura" },
  { code: "NODE-004", name: "Sohirab", genre: "Techno / Experimental", crop: "crop-d", dropboxFolder: "/ACCU/Residents/sohirab" },
] as const;
