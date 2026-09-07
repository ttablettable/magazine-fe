import { NextResponse } from "next/server";
import {
  getCanonicalStoryDocumentBySlug,
  StoryIntegrityError,
  StoryNotFoundError,
  StoryValidationError,
  listStoryRevisionsById,
} from "@/lib/storyService";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const storyId = searchParams.get("storyId");
    const folder = searchParams.get("folder");
    const slug = searchParams.get("slug");
    const cursor = searchParams.get("cursor");

    if (storyId) {
      const history = await listStoryRevisionsById(storyId, {
        cursor: cursor ?? null,
        consistency: "cached",
      });

      return NextResponse.json(history);
    }

    if (!folder || !slug) {
      return NextResponse.json(
        { error: "Missing folder or slug" },
        { status: 400 },
      );
    }

    const post = await getCanonicalStoryDocumentBySlug(slug, {
      consistency: "cached",
    });

    if (!post || post.folder !== folder) {
      return NextResponse.json({ revisions: [], pageInfo: { hasNextPage: false, endCursor: null } });
    }

    const history = await listStoryRevisionsById(post.storyId, {
      cursor: cursor ?? null,
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

    console.error("Error in /api/revisions:", err);
    return NextResponse.json({ error: "Failed to fetch revisions" }, { status: 500 });
  }
}
