import { NextResponse } from "next/server";
import {
  listStoryRevisionsById,
  StoryIntegrityError,
  StoryNotFoundError,
  StoryValidationError,
} from "@/lib/storyService";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ storyId: string }> },
) {
  try {
    const { storyId } = await params;
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const pageSizeParam = searchParams.get("pageSize");
    const pageSize = pageSizeParam ? Number(pageSizeParam) : 10;

    if (
      Number.isNaN(pageSize) ||
      !Number.isInteger(pageSize) ||
      pageSize < 1 ||
      pageSize > 100
    ) {
      throw new StoryValidationError("Invalid pageSize");
    }

    const history = await listStoryRevisionsById(storyId, {
      cursor: cursor ?? null,
      pageSize,
      consistency: "cached",
    });

    return NextResponse.json(history);
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

    console.error("Error in /api/stories/[storyId]/revisions:", err);
    return NextResponse.json(
      { error: "Failed to fetch story revisions" },
      { status: 500 },
    );
  }
}
