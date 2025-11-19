import matter from "gray-matter";

export interface ParsedMarkdown {
  slug: string;
  headline: string;
  intro: string;
  published?: string;
  authors: string[];
  issue?: string;
  channel?: string;
  featured?: boolean;
  content: string;
}

export function parseMarkdown(raw: string, slug: string): ParsedMarkdown {
  const { data, content } = matter(raw);

  return {
    slug,
    headline: data.headline || slug,
    intro: data.intro || "",
    published: data.published || null,
    authors: Array.isArray(data["author(s)"])
      ? data["author(s)"]
      : data["author(s)"]
      ? [data["author(s)"]]
      : [],
    issue: data.issue || "",
    channel: data.channel || "",
    featured: data.featured || false,
    content,
  };
}