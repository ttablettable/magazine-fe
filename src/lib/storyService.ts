import "server-only";

import {
  githubGraphqlRequest,
  GITHUB_BRANCH,
  GITHUB_OWNER,
  GITHUB_REPO,
  type GitHubConsistency,
} from "@/lib/githubClient";
import { parseMarkdown } from "@/lib/parseMarkdown";
import { isValidFullSha, isValidStoryId } from "@/lib/storyIdentity";
import type {
  CanonicalStory,
  CanonicalStoryDocument,
  GitHubPost,
  Revision,
  RevisionStatus,
  StoryFolder,
} from "@/lib/storyTypes";

type TreeEntry = {
  name: string;
  type: string;
  object?: {
    text?: string | null;
  } | null;
};

type FolderTree = {
  entries: TreeEntry[];
} | null;

type StoryHistoryNode = {
  oid: string;
  abbreviatedOid: string;
  committedDate: string;
  messageHeadline: string;
  author: { name: string | null } | null;
};

export class StoryValidationError extends Error {
  readonly status = 400;

  constructor(message: string) {
    super(message);
    this.name = "StoryValidationError";
  }
}

export class StoryNotFoundError extends Error {
  readonly status = 404;

  constructor(message: string) {
    super(message);
    this.name = "StoryNotFoundError";
  }
}

export class StoryIntegrityError extends Error {
  readonly status = 409;

  constructor(message: string) {
    super(message);
    this.name = "StoryIntegrityError";
  }
}

type StoryRecord = {
  storyId: string | null;
  slug: string;
  headline: string;
  intro?: string;
  published?: string | null;
  authors: string[];
  issue?: string | null;
  channel?: string | null;
  featured?: boolean;
  keyImage?: string | null;
  content: string;
  folder: StoryFolder;
  path: string;
  rawStoryId: string | null;
};

function buildCanonicalStory(
  record: StoryRecord,
  revisionState: {
    currentRevisionSha: string;
    lastModified: string | null;
    revisionCount: number;
  },
): CanonicalStory {
  const storyId = record.rawStoryId;

  if (!storyId) {
    throw new StoryIntegrityError(
      `Current record ${record.slug} is missing a valid ZID`,
    );
  }

  return {
    storyId,
    slug: record.slug,
    folder: record.folder,
    path: record.path,
    currentRevisionSha: revisionState.currentRevisionSha,
    revisionSha: revisionState.currentRevisionSha,
    lastModified: revisionState.lastModified,
    headline: record.headline,
    intro: record.intro,
    authors: record.authors,
    published: record.published,
    issue: record.issue,
    channel: record.channel,
    featured: record.featured,
    keyImage: record.keyImage,
    revisionCount: revisionState.revisionCount,
  };
}

function buildCanonicalDocument(
  record: StoryRecord,
  revisionState: {
    currentRevisionSha: string;
    lastModified: string | null;
    revisionCount: number;
  },
): CanonicalStoryDocument {
  return {
    ...buildCanonicalStory(record, revisionState),
    content: record.content,
  };
}

function toGitHubPost(
  record: StoryRecord,
  revisionState: {
    currentRevisionSha: string;
    lastModified: string | null;
    revisionCount: number;
  },
): GitHubPost {
  const canonical = buildCanonicalDocument(record, revisionState);

  return {
    ...canonical,
    revisionSha: canonical.currentRevisionSha,
    currentRevisionSha: canonical.currentRevisionSha,
  };
}

async function scanFolder(
  folder: StoryFolder,
  consistency: GitHubConsistency,
): Promise<StoryRecord[]> {
  const data = await githubGraphqlRequest<{
    repository: {
      object: FolderTree;
    } | null;
  }>(
    `
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
    `,
    {
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      expression: `${GITHUB_BRANCH}:${folder}`,
    },
    consistency,
  );

  const entries = data?.repository?.object?.entries ?? [];

  return entries
    .filter(
      (entry) =>
        entry.type === "blob" &&
        entry.name.endsWith(".md") &&
        Boolean(entry.object?.text),
    )
    .map((entry) => {
      const slug = entry.name.replace(/\.md$/, "");
      const parsed = parseMarkdown(entry.object?.text ?? "", slug);

      return {
        ...parsed,
        folder,
        path: `${folder}/${entry.name}`,
        rawStoryId: parsed.storyId,
      };
    });
}

async function resolveStoryRecords(
  consistency: GitHubConsistency,
): Promise<StoryRecord[]> {
  const [liveRecords, archiveRecords] = await Promise.all([
    scanFolder("live", consistency),
    scanFolder("archive", consistency),
  ]);

  return [...liveRecords, ...archiveRecords];
}

async function fetchPathRevisionState(
  path: string,
  consistency: GitHubConsistency,
): Promise<{
  currentRevisionSha: string;
  lastModified: string | null;
  revisionCount: number;
}> {
  const data = await githubGraphqlRequest<{
    repository: {
      ref: {
        target: {
          history: {
            totalCount: number;
            edges: { node: StoryHistoryNode }[];
          } | null;
        } | null;
      } | null;
    } | null;
  }>(
    `
      query (
        $owner: String!,
        $repo: String!,
        $qualifiedName: String!,
        $path: String!
      ) {
        repository(owner: $owner, name: $repo) {
          ref(qualifiedName: $qualifiedName) {
            target {
              ... on Commit {
                history(first: 1, path: $path) {
                  totalCount
                  edges {
                    node {
                      oid
                      committedDate
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    {
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      qualifiedName: GITHUB_BRANCH,
      path,
    },
    consistency,
  );

  const history = data?.repository?.ref?.target?.history;
  const currentRevisionSha = history?.edges[0]?.node?.oid;

  if (!history || !currentRevisionSha) {
    throw new StoryNotFoundError(`No current revision found for path ${path}`);
  }

  return {
    currentRevisionSha,
    lastModified: history.edges[0]?.node?.committedDate ?? null,
    revisionCount: history.totalCount ?? history.edges.length,
  };
}

function findUniqueStoryRecordById(
  records: StoryRecord[],
  storyId: string,
): StoryRecord | null {
  const matches = records.filter((record) => record.rawStoryId === storyId);

  if (matches.length > 1) {
    throw new StoryIntegrityError(
      `Multiple current records found for storyId ${storyId}`,
    );
  }

  return matches[0] ?? null;
}

function findUniqueStoryRecordBySlug(
  records: StoryRecord[],
  slug: string,
): StoryRecord | null {
  const matches = records.filter((record) => record.slug === slug);

  if (matches.length > 1) {
    throw new StoryIntegrityError(
      `Multiple current records found for slug ${slug}`,
    );
  }

  return matches[0] ?? null;
}

export async function listCurrentStories(
  consistency: GitHubConsistency = "cached",
): Promise<CanonicalStoryDocument[]> {
  const records = await resolveStoryRecords(consistency);

  return Promise.all(
    records.map(async (record) => {
      const revisionState = await fetchPathRevisionState(
        record.path,
        consistency,
      );

      return buildCanonicalDocument(record, revisionState);
    }),
  );
}

export async function getCanonicalStoryById(
  storyId: string,
  options: { consistency?: GitHubConsistency } = {},
): Promise<CanonicalStory | null> {
  if (!isValidStoryId(storyId)) {
    throw new StoryValidationError(`Invalid storyId ${storyId}`);
  }

  const consistency = options.consistency ?? "cached";
  const records = await resolveStoryRecords(consistency);
  const record = findUniqueStoryRecordById(records, storyId);

  if (!record) {
    return null;
  }

  const revisionState = await fetchPathRevisionState(record.path, consistency);

  return buildCanonicalStory(record, revisionState);
}

export async function getCanonicalStoryDocumentById(
  storyId: string,
  options: { consistency?: GitHubConsistency } = {},
): Promise<CanonicalStoryDocument | null> {
  if (!isValidStoryId(storyId)) {
    throw new StoryValidationError(`Invalid storyId ${storyId}`);
  }

  const consistency = options.consistency ?? "cached";
  const records = await resolveStoryRecords(consistency);
  const record = findUniqueStoryRecordById(records, storyId);

  if (!record) {
    return null;
  }

  const revisionState = await fetchPathRevisionState(record.path, consistency);

  return buildCanonicalDocument(record, revisionState);
}

export async function getCanonicalStoryDocumentBySlug(
  slug: string,
  options: { consistency?: GitHubConsistency } = {},
): Promise<CanonicalStoryDocument | null> {
  const consistency = options.consistency ?? "cached";
  const records = await resolveStoryRecords(consistency);
  const record = findUniqueStoryRecordBySlug(records, slug);

  if (!record) {
    return null;
  }

  if (!record.rawStoryId || !isValidStoryId(record.rawStoryId)) {
    throw new StoryIntegrityError(
      `Story ${slug} is missing a valid ZID in current content`,
    );
  }

  const revisionState = await fetchPathRevisionState(record.path, consistency);

  return buildCanonicalDocument(record, revisionState);
}

export async function verifyCurrentRevision(
  storyId: string,
  suppliedRevisionSha: string,
): Promise<RevisionStatus> {
  if (!isValidStoryId(storyId)) {
    throw new StoryValidationError(`Invalid storyId ${storyId}`);
  }

  if (!isValidFullSha(suppliedRevisionSha)) {
    throw new StoryValidationError(`Invalid revision SHA ${suppliedRevisionSha}`);
  }

  const story = await getCanonicalStoryById(storyId, {
    consistency: "fresh",
  });

  if (!story) {
    throw new StoryNotFoundError(`Story ${storyId} not found`);
  }

  return {
    suppliedRevisionSha,
    currentRevisionSha: story.currentRevisionSha,
    isCurrent: story.currentRevisionSha === suppliedRevisionSha,
  };
}

export async function listStoryRevisionsById(
  storyId: string,
  options: {
    cursor?: string | null;
    pageSize?: number;
    consistency?: GitHubConsistency;
  } = {},
): Promise<{
  story: CanonicalStory | null;
  revisions: Revision[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
  revisionCount: number;
}> {
  if (!isValidStoryId(storyId)) {
    throw new StoryValidationError(`Invalid storyId ${storyId}`);
  }

  const consistency = options.consistency ?? "cached";
  const story = await getCanonicalStoryById(storyId, { consistency });

  if (!story) {
    throw new StoryNotFoundError(`Story ${storyId} not found`);
  }

  const pageSize = options.pageSize ?? 10;

  const data = await githubGraphqlRequest<{
    repository: {
      ref: {
        target: {
          history: {
            pageInfo: {
              hasNextPage: boolean;
              endCursor: string | null;
            };
            totalCount: number;
            edges: { node: StoryHistoryNode }[];
          } | null;
        } | null;
      } | null;
    } | null;
  }>(
    `
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
                  totalCount
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
    `,
    {
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      qualifiedName: GITHUB_BRANCH,
      path: story.path,
      first: pageSize,
      after: options.cursor ?? null,
    },
    consistency,
  );

  const history = data?.repository?.ref?.target?.history;
  if (!history) {
    return {
      story,
      revisions: [],
      pageInfo: { hasNextPage: false, endCursor: null },
      revisionCount: story.revisionCount ?? 0,
    };
  }

  const revisions: Revision[] = history.edges.map(({ node }) => ({
    revisionSha: node.oid,
    sha: node.oid,
    shortSha: node.abbreviatedOid,
    date: node.committedDate,
    message: node.messageHeadline,
    authorName: node.author?.name ?? "Unknown",
  }));

  return {
    story: {
      ...story,
      revisionCount: history.totalCount ?? story.revisionCount,
    },
    revisions,
    pageInfo: history.pageInfo,
    revisionCount: history.totalCount ?? story.revisionCount ?? 0,
  };
}

export async function getRevisionContentByStoryId(
  storyId: string,
  revisionSha: string,
  options: { consistency?: GitHubConsistency } = {},
): Promise<string | null> {
  if (!isValidStoryId(storyId)) {
    throw new StoryValidationError(`Invalid storyId ${storyId}`);
  }

  if (!isValidFullSha(revisionSha)) {
    throw new StoryValidationError(`Invalid revision SHA ${revisionSha}`);
  }

  const consistency = options.consistency ?? "fresh";
  const story = await getCanonicalStoryById(storyId, { consistency });

  if (!story) {
    throw new StoryNotFoundError(`Story ${storyId} not found`);
  }

  const data = await githubGraphqlRequest<{
    repository: { object: { text?: string | null } | null } | null;
  }>(
    `
      query ($owner: String!, $repo: String!, $expression: String!) {
        repository(owner: $owner, name: $repo) {
          object(expression: $expression) {
            ... on Blob {
              text
            }
          }
        }
      }
    `,
    {
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      expression: `${revisionSha}:${story.path}`,
    },
    consistency,
  );

  return data?.repository?.object?.text ?? null;
}

export async function getStoryDocumentBySlug(
  slug: string,
  options: { consistency?: GitHubConsistency } = {},
): Promise<CanonicalStoryDocument | null> {
  if (!slug) {
    throw new StoryValidationError("Missing story slug");
  }

  return getCanonicalStoryDocumentBySlug(slug, options);
}

export async function getStoryPageDataBySlug(
  slug: string,
  options: { consistency?: GitHubConsistency } = {},
): Promise<CanonicalStoryDocument | null> {
  return getStoryDocumentBySlug(slug, options);
}

export async function getStoryRevisionViewBySlug(
  slug: string,
  revisionSha: string,
  options: { consistency?: GitHubConsistency } = {},
): Promise<CanonicalStoryDocument | null> {
  const story = await getCanonicalStoryDocumentBySlug(slug, options);
  if (!story) {
    return null;
  }

  const text = await getRevisionContentByStoryId(story.storyId, revisionSha, {
    consistency: options.consistency ?? "fresh",
  });

  if (!text) {
    return null;
  }

  const parsed = parseMarkdown(text, story.slug);

  return {
    storyId: story.storyId,
    slug: story.slug,
    folder: story.folder,
    path: story.path,
    currentRevisionSha: revisionSha,
    revisionSha,
    lastModified: story.lastModified,
    headline: parsed.headline ?? story.headline,
    intro: parsed.intro ?? story.intro,
    authors: parsed.authors.length > 0 ? parsed.authors : story.authors,
    published: parsed.published ?? story.published,
    issue: parsed.issue ?? story.issue,
    channel: parsed.channel ?? story.channel,
    featured: parsed.featured ?? story.featured,
    keyImage: parsed.keyImage ?? story.keyImage,
    revisionCount: story.revisionCount,
    content: parsed.content,
  };
}

export async function fetchCurrentPostsByFolder(
  folder: StoryFolder,
  consistency: GitHubConsistency = "cached",
): Promise<GitHubPost[]> {
  const records = await scanFolder(folder, consistency);

  const posts = await Promise.all(
    records.map(async (record) => {
      const revisionState = await fetchPathRevisionState(
        record.path,
        consistency,
      );

      return toGitHubPost(record, revisionState);
    }),
  );

  return posts.sort((a, b) => {
    if (!a.lastModified) return 1;
    if (!b.lastModified) return -1;
    return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
  });
}
