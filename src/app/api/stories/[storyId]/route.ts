import { NextResponse } from "next/server";
import {
  getCanonicalStoryById,
  StoryIntegrityError,
  StoryNotFoundError,
  StoryValidationError,
} from "@/lib/storyService";
import { isValidFullSha } from "@/lib/storyIdentity";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ storyId: string }> },
) {
  try {
    const { storyId } = await params;
    const { searchParams } = new URL(req.url);
    const revisionSha = searchParams.get("revisionSha");

    const story = await getCanonicalStoryById(storyId, {
      consistency: revisionSha ? "fresh" : "cached",
    });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    const revisionStatus =
      revisionSha === null
        ? null
        : (() => {
            if (!isValidFullSha(revisionSha)) {
              throw new StoryValidationError("Invalid revision SHA");
            }

            return {
              suppliedRevisionSha: revisionSha,
              currentRevisionSha: story.currentRevisionSha,
              isCurrent: story.currentRevisionSha === revisionSha,
            };
          })();

    return NextResponse.json({
      story,
      revisionStatus,
    });
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

    console.error("Error in /api/stories/[storyId]:", err);
    return NextResponse.json(
      { error: "Failed to resolve canonical story" },
      { status: 500 },
    );
  }
}
