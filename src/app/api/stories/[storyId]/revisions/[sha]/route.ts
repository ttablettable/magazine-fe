import { NextResponse } from "next/server";
import {
  getRevisionContentByStoryId,
  StoryIntegrityError,
  StoryNotFoundError,
  StoryValidationError,
} from "@/lib/storyService";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ storyId: string; sha: string }> },
) {
  try {
    const { storyId, sha } = await params;

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

    console.error("Error in /api/stories/[storyId]/revisions/[sha]:", err);
    return NextResponse.json(
      { error: "Failed to fetch revision text" },
      { status: 500 },
    );
  }
}
