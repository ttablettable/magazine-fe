import { NextResponse } from "next/server";
import { fetchRevisionHistory } from "@/utils/fetchRevisions";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const folder = searchParams.get("folder");
    const slug = searchParams.get("slug");
    const cursor = searchParams.get("cursor");

    if (!folder || !slug) {
      return NextResponse.json({ error: "Missing folder or slug" }, { status: 400 });
    }

    const history = await fetchRevisionHistory(
      folder as "live" | "archive",
      slug,
      cursor ?? null
    );

    return NextResponse.json(history);
  } catch (err) {
    console.error("Error in /api/revisions:", err);
    return NextResponse.json({ error: "Failed to fetch revisions" }, { status: 500 });
  }
}
