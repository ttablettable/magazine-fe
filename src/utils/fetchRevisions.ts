import "server-only";

import type { Revision } from "@/lib/storyTypes";
import {
  getCanonicalStoryDocumentBySlug,
  getRevisionContentByStoryId,
  listStoryRevisionsById,
} from "@/lib/storyService";

export type { Revision } from "@/lib/storyTypes";

export interface RevisionHistoryResult {
  revisions: Revision[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
}

/**
 * Fetch first 10 commits for a file, optionally paging with `cursor`.
 */
export async function fetchRevisionHistory(
  folder: "live" | "archive",
  slug: string,
  cursor?: string | null,
  pageSize: number = 10
): Promise<RevisionHistoryResult> {
  const post = await getCanonicalStoryDocumentBySlug(slug, {
    consistency: "cached",
  });

  if (!post || post.folder !== folder) {
    return {
      revisions: [],
      pageInfo: { hasNextPage: false, endCursor: null },
    };
  }

  const history = await listStoryRevisionsById(post.storyId, {
    cursor: cursor ?? null,
    pageSize,
    consistency: "cached",
  });

  return {
    revisions: history.revisions,
    pageInfo: history.pageInfo,
  };
}

/**
 * Fetch file content at a specific commit SHA.
 */
export async function fetchRevisionContent(
  folder: "live" | "archive",
  slug: string,
  sha: string
): Promise<string | null> {
  const post = await getCanonicalStoryDocumentBySlug(slug, {
    consistency: "fresh",
  });

  if (!post || post.folder !== folder) {
    return null;
  }

  return getRevisionContentByStoryId(post.storyId, sha, {
    consistency: "fresh",
  });
}
