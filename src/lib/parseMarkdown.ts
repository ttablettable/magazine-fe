import matter from "gray-matter";

export interface ParsedMarkdown {
  // Canonical story identity from frontmatter. This is the stable ZID/root ID.
  storyId: string | null;
  slug: string;
  headline: string;
  intro: string;
  published?: string;
  authors: string[];
  issue?: string;
  channel?: string;
  featured?: boolean;
  keyImage?: string;
  content: string;
}

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
    issue: data.issue || "",
    channel: data.channel || "",
    featured: data.featured || false,
    keyImage: data["key-image"] || data.keyImage || null,

    content,
  };
}
