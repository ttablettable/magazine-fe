import { NextResponse } from "next/server";
import { fetchRevisionContent } from "@/utils/fetchRevisions";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const folder = searchParams.get("folder");
    const slug = searchParams.get("slug");
    const sha = searchParams.get("sha");

    if (!folder || !slug || !sha) {
      return NextResponse.json(
        { error: "Missing folder, slug, or sha" },
        { status: 400 }
      );
    }

    const text = await fetchRevisionContent(
      folder as "live" | "archive",
      slug,
      sha
    );

    if (!text) {
      return NextResponse.json(
        { error: "Revision not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ text });
  } catch (err) {
    console.error("Error in /api/revision-content:", err);
    return NextResponse.json(
      { error: "Failed to fetch revision text" },
      { status: 500 }
    );
  }
}
