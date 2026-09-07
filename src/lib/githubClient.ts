import "server-only";

export type GitHubConsistency = "cached" | "fresh";

export const GITHUB_API_URL = "https://api.github.com/graphql";
export const GITHUB_OWNER = "ttablettable";
export const GITHUB_REPO = "content";
export const GITHUB_BRANCH = "main";

function getFetchInit(consistency: GitHubConsistency): RequestInit {
  if (consistency === "fresh") {
    return { cache: "no-store" };
  }

  return { next: { revalidate: 600 } };
}

export async function githubGraphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
  consistency: GitHubConsistency = "cached",
): Promise<T> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("Missing GITHUB_TOKEN");
  }

  const res = await fetch(GITHUB_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    ...getFetchInit(consistency),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("GitHub GraphQL HTTP error:", errorText);
    throw new Error(`GitHub GraphQL request failed with ${res.status}`);
  }

  const json = (await res.json()) as {
    data?: T;
    errors?: { message?: string }[];
  };

  if (json.errors?.length) {
    const message = json.errors
      .map((error) => error.message)
      .filter(Boolean)
      .join("; ");
    console.error("GitHub GraphQL response errors:", message);
    throw new Error("GitHub GraphQL request failed");
  }

  if (!json.data) {
    throw new Error("GitHub GraphQL response missing data");
  }

  return json.data;
}
