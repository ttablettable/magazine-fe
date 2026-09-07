export const STORY_ID_PATTERN = /^\d{14}$/;
export const FULL_SHA_PATTERN = /^[a-f0-9]{40}$/i;

export function isValidStoryId(storyId: string): boolean {
  return STORY_ID_PATTERN.test(storyId);
}

export function isValidFullSha(sha: string): boolean {
  return FULL_SHA_PATTERN.test(sha);
}
