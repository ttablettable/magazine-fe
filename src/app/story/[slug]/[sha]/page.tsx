import Link from "next/link";
import { getStoryRevisionViewBySlug } from "@/lib/storyService";
import StoryPage from "@/components/story/StoryPage";

export default async function StoryRevisionPage({
  params,
}: {
  params: Promise<{
    slug: string;
    sha: string;
  }>;
}) {
  const { slug, sha: revisionSha } = await params;

  const post = await getStoryRevisionViewBySlug(slug, revisionSha);

  if (!post) {
    return (
      <main style={{ padding: "4rem" }}>
        <h1>404 – Story not found</h1>
        <p>This story doesn&apos;t exist or may have been removed.</p>
        <Link href="/">Back to the feed</Link>
      </main>
    );
  }

  return (
    <StoryPage
      post={post}
      relatedPosts={[]}
      isRevision
      revisionSha={revisionSha}
    />
  );
}
