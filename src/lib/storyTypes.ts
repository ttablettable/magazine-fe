export type StoryFolder = "live" | "archive";

export interface ParsedMarkdown {
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
}

export interface GitHubPost extends ParsedMarkdown {
  folder: StoryFolder;
  path: string;
  currentRevisionSha?: string;
  revisionSha?: string;
  lastModified: string | null;
  revisionCount?: number;
}

export interface Revision {
  revisionSha: string;
  sha: string;
  shortSha: string;
  date: string;
  message: string;
  authorName: string;
}

export interface CanonicalStory {
  storyId: string;
  slug: string;
  folder: StoryFolder;
  path: string;
  currentRevisionSha: string;
  revisionSha?: string;
  lastModified: string | null;
  headline: string;
  intro?: string;
  authors: string[];
  published?: string | null;
  issue?: string | null;
  channel?: string | null;
  featured?: boolean;
  keyImage?: string | null;
  revisionCount?: number;
}

export interface CanonicalStoryDocument extends CanonicalStory {
  content: string;
}

export interface RevisionStatus {
  suppliedRevisionSha: string;
  currentRevisionSha: string;
  isCurrent: boolean;
}
