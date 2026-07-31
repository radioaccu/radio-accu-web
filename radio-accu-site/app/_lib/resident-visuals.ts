const residentImagePositions: Record<string, string> = {
  maraschino: "50% 24%",
  savan: "50% 44%",
};

export function getResidentImagePosition(slug: string) {
  return residentImagePositions[slug] ?? "center";
}
