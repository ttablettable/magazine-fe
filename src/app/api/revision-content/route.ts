import { NextResponse } from "next/server";
import { fetchRevisionContent } from "@/utils/fetchRevisions";
import { getRevisionContentByStoryId, StoryIntegrityError, StoryNotFoundError, StoryValidationError } from "@/lib/storyService";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const storyId = searchParams.get("storyId");
    const folder = searchParams.get("folder");
    const slug = searchParams.get("slug");
    const sha = searchParams.get("sha");

    if (storyId && sha) {
      const text = await getRevisionContentByStoryId(storyId, sha, {
        consistency: "fresh",
      });

      if (!text) {
        return NextResponse.json(
          { error: "Revision not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({ text });
    }

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
    if (err instanceof StoryValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    if (err instanceof StoryNotFoundError) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }

    if (err instanceof StoryIntegrityError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }

    console.error("Error in /api/revision-content:", err);
    return NextResponse.json(
      { error: "Failed to fetch revision text" },
      { status: 500 }
    );
  }
}
