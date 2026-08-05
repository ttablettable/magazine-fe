import Link from "next/link";
import { fetchArchivePosts } from "@/lib/githubFetch";
import { fetchRevisionContent } from "@/utils/fetchRevisions";
import { parseMarkdown } from "@/lib/parseMarkdown";
import StoryPage from "@/components/story/StoryPage";

export default async function StoryRevisionPage({
  params,
}: {
  params: Promise<{
    slug: string;
    sha: string;
  }>;
}) {
  const { slug, sha } = await params;

  // 1. Base metadata
  const posts = await fetchArchivePosts();
  const basePost = posts.find((p) => p.slug === slug);

  if (!basePost) {
    return (
      <main style={{ padding: "4rem" }}>
        <h1>404 – Story not found</h1>
        <p>This story doesn&apos;t exist or may have been removed.</p>
        <Link href="/">Back to the feed</Link>
      </main>
    );
  }

  // 2. Raw markdown at revision
  const raw = await fetchRevisionContent("archive", slug, sha);

  if (!raw) {
    return (
      <main style={{ padding: "4rem" }}>
        <h1>404 – Revision not found</h1>
        <p>This revision doesn&apos;t exist or may have been removed.</p>
        <Link href={`/story/${slug}`}>Back to the story</Link>
      </main>
    );
  }

  // 3. Parse markdown (THIS removes front matter)
  const parsed = parseMarkdown(raw, slug);

  // 4. Merge parsed content with base metadata
  const post = {
    ...basePost,
    ...parsed,
    lastModified: new Date().toISOString(),
  };

  return (
    <StoryPage
      post={post}
      relatedPosts={[]}
      isRevision
      revisionSha={sha}
    />
  );
}
