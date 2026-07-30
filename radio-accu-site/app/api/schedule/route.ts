import { getSchedule } from "../../_lib/schedule";

export async function GET() {
  const schedule = await getSchedule();

  return Response.json(schedule, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
