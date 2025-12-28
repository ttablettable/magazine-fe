import { parseMarkdown, ParsedMarkdown } from "@/lib/parseMarkdown";

const GITHUB_API_URL = "https://api.github.com/graphql";
const OWNER = "ttablettable";
const REPO = "content";

export interface GitHubPost extends ParsedMarkdown {
  path: string;
  lastModified: string;
}

async function githubRequest<T>(query: string, variables?: Record<string, any>): Promise<T> {
  const res = await fetch(GITHUB_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 120 },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("GitHub API error:", errorText);
    throw new Error(`GitHub API error: ${res.statusText}`);
  }

  const json = await res.json();
  return json.data;
}

async function fetchPostsFromFolder(folder: "live" | "archive"): Promise<GitHubPost[]> {
  const query = `
    query ($owner: String!, $repo: String!, $expression: String!) {
      repository(owner: $owner, name: $repo) {
        object(expression: $expression) {
          ... on Tree {
            entries {
              name
              type
              object {
                ... on Blob {
                  text
                  commitResourcePath
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await githubRequest<{
    repository: {
      object: {
        entries: {
          name: string;
          type: "blob" | "tree";
          object: { text: string; commitResourcePath: string } | null;
        }[];
      } | null;
    } | null;
  }>(query, {
    owner: OWNER,
    repo: REPO,
    expression: `main:${folder}`,
  });

  const entries = data?.repository?.object?.entries ?? [];

  const posts: GitHubPost[] = entries
    .filter((entry) => entry.type === "blob" && entry.name.endsWith(".md") && entry.object?.text)
    .map((entry) => {
      const slug = entry.name.replace(/\.md$/, "");
      const parsed = parseMarkdown(entry.object!.text, slug);

      return {
        ...parsed,
        path: `${folder}/${entry.name}`,
        // If you want: derive lastModified from commitResourcePath later.
        lastModified: new Date().toISOString(),
      };
    });

  return posts.sort(
    (a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
  );
}

export async function fetchArchivePosts(): Promise<GitHubPost[]> {
  return fetchPostsFromFolder("archive");
}

export async function fetchLivePosts(): Promise<GitHubPost[]> {
  return fetchPostsFromFolder("live");
}

export async function fetchPostBySlug(
  slug: string,
  folder: "live" | "archive"
): Promise<GitHubPost | null> {
  const query = `
    query ($owner: String!, $repo: String!, $expression: String!) {
      repository(owner: $owner, name: $repo) {
        object(expression: $expression) {
          ... on Blob {
            text
          }
        }
      }
    }
  `;

  const data = await githubRequest<{
    repository: { object: { text: string } | null } | null;
  }>(query, {
    owner: OWNER,
    repo: REPO,
    expression: `main:${folder}/${slug}.md`,
  });

  const blob = data?.repository?.object;
  if (!blob?.text) return null;

  const parsed = parseMarkdown(blob.text, slug);

  return {
    ...parsed,
    path: `${folder}/${slug}.md`,
    lastModified: new Date().toISOString(),
  };
}
