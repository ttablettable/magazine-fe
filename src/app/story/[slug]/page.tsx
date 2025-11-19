import { fetchArchivePosts } from "@/utils/githubFetch";
import StoryPage from "@/components/story/StoryPage";

type StoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Story({ params }: StoryPageProps) {
  const { slug } = await params;

  // Fetch all posts (you can optimize later to fetch just one)
  const posts = await fetchArchivePosts();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <main style={{ padding: "4rem" }}>
        <h1>404 – Story Not Found</h1>
        <p>We couldn’t find that story in the archive.</p>
      </main>
    );
  }

  return <StoryPage post={post} />;
}