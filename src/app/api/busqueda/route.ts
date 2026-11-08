import { getSearchRecords } from "@/lib/catalog";

export function GET() {
  return Response.json(getSearchRecords(), {
    headers: {
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
