import type { GitHubPost } from "@/utils/githubFetch";
import type { Activity } from "@/components/activity/activity.types";

type BuildActivityArgs = {
  authorSlug: string;
  posts: GitHubPost[];
};

function normalizeDate(date?: string) {
  return date ? new Date(date).toISOString() : undefined;
}

export function buildActivity({
  authorSlug,
  posts,
}: BuildActivityArgs): Activity[] {
  console.log("[activityBuilder] authorSlug:", authorSlug);
  console.log("[activityBuilder] posts:", posts.length);

  return posts
    .filter((post) => post.authors.includes(authorSlug))
    .map((post): Activity => ({
      id: `authored-${post.slug}`,
      type: "authored",
      title: post.headline,
      storySlug: post.slug,
      issue: post.issue || undefined,
      date: normalizeDate(post.published || post.lastModified),
    }));
}