import type { GitHubPost } from "@/lib/githubFetch";
import type { Activity } from "@/components/activity/activity.types";

type BuildActivityArgs = {
  authorSlug: string;
  posts: GitHubPost[];
};

function normalizeDate(date?: Date | string | null) {
  if (!date) return undefined;

  const parsed = typeof date === "string" ? new Date(date) : date;

  return parsed.toISOString();
}

export function buildActivity({
  authorSlug,
  posts,
}: BuildActivityArgs): Activity[] {
  return posts
    .filter((post) => post.authors.includes(authorSlug))
    .map((post): Activity => ({
      id: `authored-${post.slug}`,
      type: "authored",
      title: post.headline,
      storySlug: post.slug,
      issue: post.issue || undefined,
      date: normalizeDate(post.published ?? post.lastModified),
    }));
}