import "server-only";

import type { GitHubPost } from "@/lib/storyTypes";
import {
  fetchCurrentPostsByFolder,
  getCanonicalStoryDocumentBySlug,
} from "@/lib/storyService";

export type { GitHubPost } from "@/lib/storyTypes";

export async function fetchArchivePosts(): Promise<GitHubPost[]> {
  return fetchCurrentPostsByFolder("archive");
}

export async function fetchLivePosts(): Promise<GitHubPost[]> {
  return fetchCurrentPostsByFolder("live");
}

export async function fetchPostBySlug(
  slug: string,
  folder: "live" | "archive",
): Promise<GitHubPost | null> {
  const post = await getCanonicalStoryDocumentBySlug(slug);

  if (!post || post.folder !== folder) {
    return null;
  }

  return {
    ...post,
    revisionSha: post.currentRevisionSha,
    currentRevisionSha: post.currentRevisionSha,
  };
}
