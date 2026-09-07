import Link from "next/link";
import { fetchArchivePosts } from "@/lib/githubFetch";
import { getStoryPageDataBySlug } from "@/lib/storyService";
import StoryPage from "@/components/story/StoryPage";

type StoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Story({ params }: StoryPageProps) {
  const { slug } = await params;

  const post = await getStoryPageDataBySlug(slug);

  if (!post) {
    return (
      <main style={{ padding: "4rem" }}>
        <h1>404 – Story not found</h1>
        <p>This story doesn&apos;t exist or may have been removed.</p>
        <Link href="/">Back to the feed</Link>
      </main>
    );
  }

  const posts = await fetchArchivePosts();

  return <StoryPage post={post} relatedPosts={posts} />;
}
