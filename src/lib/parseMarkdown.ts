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
  keyImage?: string;
  content: string;
}

export function parseMarkdown(raw: string, slug: string): ParsedMarkdown {
  const { data, content } = matter(raw);

  const authors =
    Array.isArray(data["author(s)"])
      ? data["author(s)"]
      : data["author(s)"]
      ? [data["author(s)"]]
      : [];

  return {
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