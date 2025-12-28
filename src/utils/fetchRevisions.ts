const GITHUB_API_URL = "https://api.github.com/graphql";
const OWNER = "ttablettable";
const REPO = "content";
const DEFAULT_BRANCH = "main";

async function githubRequest<T>(query: string, variables?: Record<string, any>): Promise<T> {
  const res = await fetch(GITHUB_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    // no cache, we actually want fresh history
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("GitHub API error:", errorText);
    throw new Error(`GitHub API error: ${res.statusText}`);
  }

  const json = await res.json();
  return json.data;
}

export interface Revision {
  sha: string;
  shortSha: string;
  date: string;
  message: string;
  authorName: string;
}

export interface RevisionHistoryResult {
  revisions: Revision[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
}

/**
 * Fetch first 10 commits for a file, optionally paging with `cursor`.
 */
export async function fetchRevisionHistory(
  folder: "live" | "archive",
  slug: string,
  cursor?: string | null,
  pageSize: number = 10
): Promise<RevisionHistoryResult> {
  const path = `${folder}/${slug}.md`;

  const query = `
    query (
      $owner: String!,
      $repo: String!,
      $qualifiedName: String!,
      $path: String!,
      $first: Int!,
      $after: String
    ) {
      repository(owner: $owner, name: $repo) {
        ref(qualifiedName: $qualifiedName) {
          target {
            ... on Commit {
              history(first: $first, after: $after, path: $path) {
                pageInfo {
                  hasNextPage
                  endCursor
                }
                edges {
                  node {
                    oid
                    abbreviatedOid
                    committedDate
                    messageHeadline
                    author {
                      name
                    }
                  }
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
      ref: {
        target: {
          history: {
            pageInfo: { hasNextPage: boolean; endCursor: string | null };
            edges: {
              node: {
                oid: string;
                abbreviatedOid: string;
                committedDate: string;
                messageHeadline: string;
                author: { name: string | null } | null;
              };
            }[];
          };
        };
      } | null;
    } | null;
  }>(query, {
    owner: OWNER,
    repo: REPO,
    qualifiedName: DEFAULT_BRANCH,
    path,
    first: pageSize,
    after: cursor ?? null,
  });

  const history = data?.repository?.ref?.target?.history;
  if (!history) {
    return {
      revisions: [],
      pageInfo: { hasNextPage: false, endCursor: null },
    };
  }

  const revisions: Revision[] = history.edges.map(({ node }) => ({
    sha: node.oid,
    shortSha: node.abbreviatedOid,
    date: node.committedDate,
    message: node.messageHeadline,
    authorName: node.author?.name ?? "Unknown",
  }));

  return {
    revisions,
    pageInfo: history.pageInfo,
  };
}

/**
 * Fetch file content at a specific commit SHA.
 */
export async function fetchRevisionContent(
  folder: "live" | "archive",
  slug: string,
  sha: string
): Promise<string | null> {
  const path = `${folder}/${slug}.md`;

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
    expression: `${sha}:${path}`,
  });

  const blob = data?.repository?.object;
  return blob?.text ?? null;
}
