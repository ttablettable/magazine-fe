import matter from "gray-matter";
import type { ParsedMarkdown } from "@/lib/storyTypes";

export type { ParsedMarkdown } from "@/lib/storyTypes";

function readStoryId(data: Record<string, any>): string | null {
  const rawStoryId = data.ZID ?? data.zid ?? null;

  if (rawStoryId === null || rawStoryId === undefined || rawStoryId === "") {
    return null;
  }

  const storyId = String(rawStoryId);

  return /^\d{14}$/.test(storyId) ? storyId : null;
}

export function parseMarkdown(raw: string, slug: string): ParsedMarkdown {
  const { data, content } = matter(raw);
  const storyId = readStoryId(data);

  const authors =
    Array.isArray(data["author(s)"])
      ? data["author(s)"]
      : data["author(s)"]
      ? [data["author(s)"]]
      : [];

  return {
    storyId,
    slug,
    headline: data.headline || slug,
    intro: data.intro || "",
    published: data.published || null,
    authors,
    issue: data.issue || null,
    channel: data.channel || null,
    featured: Boolean(data.featured || false),
    keyImage: data["key-image"] || data.keyImage || null,

    content,
  };
}
