import { parseMarkdown, ParsedMarkdown } from "@/lib/parseMarkdown";

const GITHUB_API_URL = "https://api.github.com/graphql";
const OWNER = "ttablettable";
const REPO = "content";

export interface GitHubPost extends ParsedMarkdown {
  slug: string;
  path: string;
  lastModified: string | null;
}

async function githubRequest<T>(
  query: string,
  variables?: Record<string, any>,
): Promise<T> {
  const res = await fetch(GITHUB_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 600 }, // 10 min cache
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("GitHub API error:", errorText);
    throw new Error(`GitHub API error: ${res.statusText}`);
  }

  const json = await res.json();
  return json.data;
}

/* ---------------------------------- */
/* Fetch per-file commit timestamp    */
/* ---------------------------------- */

async function fetchLastModified(path: string): Promise<string | null> {
  const query = `
    query ($owner: String!, $repo: String!, $path: String!) {
      repository(owner: $owner, name: $repo) {
        ref(qualifiedName: "refs/heads/main") {
          target {
            ... on Commit {
              history(first: 1, path: $path) {
                edges {
                  node {
                    committedDate
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await githubRequest<any>(query, {
    owner: OWNER,
    repo: REPO,
    path,
  });

  return (
    data?.repository?.ref?.target?.history?.edges?.[0]?.node
      ?.committedDate ?? null
  );
}

/* ---------------------------------- */
/* Fetch all posts in folder          */
/* ---------------------------------- */

async function fetchPostsFromFolder(
  folder: "live" | "archive",
): Promise<GitHubPost[]> {
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
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await githubRequest<any>(query, {
    owner: OWNER,
    repo: REPO,
    expression: `main:${folder}`,
  });

  const treeEntries = data?.repository?.object?.entries ?? [];

  const posts = await Promise.all(
    treeEntries
      .filter(
        (entry: any) =>
          entry.type === "blob" &&
          entry.name.endsWith(".md") &&
          entry.object?.text,
      )
      .map(async (entry: any): Promise<GitHubPost> => {
        const slug = entry.name.replace(/\.md$/, "");
        const parsed = parseMarkdown(entry.object.text, slug);

        const fullPath = `${folder}/${entry.name}`;
        const lastModified = await fetchLastModified(fullPath);

        return {
          ...parsed,
          slug,
          path: fullPath,
          lastModified,
        };
      }),
  );

  return posts.sort((a, b) => {
    if (!a.lastModified) return 1;
    if (!b.lastModified) return -1;
    return (
      new Date(b.lastModified).getTime() -
      new Date(a.lastModified).getTime()
    );
  });
}

/* ---------------------------------- */
/* Public API                         */
/* ---------------------------------- */

export async function fetchArchivePosts(): Promise<GitHubPost[]> {
  return fetchPostsFromFolder("archive");
}

export async function fetchLivePosts(): Promise<GitHubPost[]> {
  return fetchPostsFromFolder("live");
}

export async function fetchPostBySlug(
  slug: string,
  folder: "live" | "archive",
): Promise<GitHubPost | null> {
  const path = `${folder}/${slug}.md`;

  const query = `
    query ($owner: String!, $repo: String!, $expression: String!, $path: String!) {
      repository(owner: $owner, name: $repo) {
        object(expression: $expression) {
          ... on Blob {
            text
          }
        }
        ref(qualifiedName: "refs/heads/main") {
          target {
            ... on Commit {
              history(first: 1, path: $path) {
                edges {
                  node {
                    committedDate
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await githubRequest<any>(query, {
    owner: OWNER,
    repo: REPO,
    expression: `main:${path}`,
    path,
  });

  const blob = data?.repository?.object;
  const history =
    data?.repository?.ref?.target?.history?.edges ?? [];

  if (!blob?.text) return null;

  const parsed = parseMarkdown(blob.text, slug);

  return {
    ...parsed,
    slug,
    path,
    lastModified: history[0]?.node?.committedDate ?? null,
  };
}