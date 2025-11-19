import { parseMarkdown, ParsedMarkdown } from "@/lib/parseMarkdown";

const GITHUB_API_URL = "https://api.github.com/graphql";
const OWNER = "ttablettable";
const REPO = "content";

export interface GitHubPost extends ParsedMarkdown {
  path: string;
  lastModified: string;
}

export async function fetchArchivePosts(): Promise<GitHubPost[]> {
  const query = `
    query {
      repository(owner: "${OWNER}", name: "${REPO}") {
        object(expression: "main:archive") {
          ... on Tree {
            entries {
              name
              type
              object {
                ... on Blob {
                  text
                }
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch(GITHUB_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
    next: { revalidate: 120 },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("GitHub API error:", errorText);
    throw new Error(`GitHub API error: ${res.statusText}`);
  }

  const json = await res.json();
  const entries = json.data?.repository?.object?.entries ?? [];

  const posts: GitHubPost[] = entries
    .filter((entry: any) => entry.type === "blob" && entry.name.endsWith(".md"))
    .map((entry: any) => {
      const slug = entry.name.replace(".md", "");
      const parsed = parseMarkdown(entry.object.text, slug);

      return {
        ...parsed,
        path: `archive/${entry.name}`,
        lastModified: new Date().toISOString(),
      };
    });

  return posts.sort(
    (a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
  );
}