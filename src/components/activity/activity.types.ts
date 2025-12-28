export type ActivityType =
  | "authored"
  | "edited"
  | "annotated"
  | "moderated"
  | "collaborated"
  | "subject"
  | "collected";

export interface Activity {
  id: string;
  type: ActivityType;

  // authored-specific
  title?: string;
  storySlug?: string;
  issue?: string;

  // shared
  date?: string;
}
