const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const storyId = process.env.STORY_ID ?? "20241117194208";
const knownHistoricalSha =
  process.env.HISTORICAL_SHA ??
  "0d84fe3cb39af7a59c5bb19948c5277e46fb7851";

async function read(path) {
  const res = await fetch(`${baseUrl}${path}`);
  const text = await res.text();

  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }

  return { status: res.status, text, json };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const storyRes = await read(`/api/stories/${storyId}`);
assert(storyRes.status === 200, `expected 200 for canonical story, got ${storyRes.status}`);
const story = storyRes.json?.story;
assert(story, "canonical story missing");
assert(story.storyId === storyId, "canonical storyId mismatch");
assert(typeof story.currentRevisionSha === "string" && story.currentRevisionSha.length === 40, "currentRevisionSha must be a full SHA");
assert(story.revisionSha === story.currentRevisionSha, "current story should keep revisionSha aligned with currentRevisionSha");

const currentVerify = await read(`/api/stories/${storyId}?revisionSha=${story.currentRevisionSha}`);
assert(currentVerify.status === 200, "current SHA verification failed");
assert(currentVerify.json?.revisionStatus?.isCurrent === true, "current SHA should verify true");

const olderVerify = await read(`/api/stories/${storyId}?revisionSha=${knownHistoricalSha}`);
assert(olderVerify.status === 200, "historical SHA verification failed");
assert(olderVerify.json?.revisionStatus?.isCurrent === false, "historical SHA should verify false");

const historicalPage = await read(`/story/${story.slug}/${knownHistoricalSha}`);
assert(historicalPage.status === 200, "historical story page should return 200");
assert(
  historicalPage.text.includes(`\\"revisionSha\\":\\"${knownHistoricalSha}\\"`),
  "historical page should serialize the requested revisionSha",
);
assert(
  historicalPage.text.includes(`\\"currentRevisionSha\\":\\"${story.currentRevisionSha}\\"`),
  "historical page should serialize the currentRevisionSha",
);
assert(
  !historicalPage.text.includes(`\\"currentRevisionSha\\":\\"${knownHistoricalSha}\\"`),
  "historical page must not claim the historical SHA is current",
);

const revisions10 = await read(`/api/stories/${storyId}/revisions?pageSize=10`);
assert(revisions10.status === 200, "pageSize=10 should succeed");

const revisions100 = await read(`/api/stories/${storyId}/revisions?pageSize=100`);
assert(revisions100.status === 200, "pageSize=100 should succeed");

const revisions101 = await read(`/api/stories/${storyId}/revisions?pageSize=101`);
assert(revisions101.status === 400, "pageSize=101 should fail");

const revisionsBad = await read(`/api/stories/${storyId}/revisions?pageSize=1.5`);
assert(revisionsBad.status === 400, "non-integer pageSize should fail");

console.log(
  JSON.stringify(
    {
      storyId,
      currentRevisionSha: story.currentRevisionSha,
      historicalSha: knownHistoricalSha,
      currentVerification: currentVerify.json?.revisionStatus,
      historicalVerification: olderVerify.json?.revisionStatus,
      pageSize10: revisions10.status,
      pageSize100: revisions100.status,
      pageSize101: revisions101.status,
      pageSizeInvalid: revisionsBad.status,
    },
    null,
    2,
  ),
);
