import { extractBlockquotes } from "./extractBlockquotes";
import { GitHubPost } from "@/utils/githubFetch";

export function getAllQuotes(posts: GitHubPost[]) {
  const quotes: {
    slug: string;
    text: string;
    headline: string;
    issue: string | null;
  }[] = [];

  for (const post of posts) {
    const blocks = extractBlockquotes(post.content);

    blocks.forEach(text => {
      quotes.push({
        slug: post.slug,
        text,
        headline: post.headline,
        issue: post.issue || null,
      });
    });
  }

  return quotes;
}
