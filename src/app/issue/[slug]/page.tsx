import { fetchArchivePosts } from "@/lib/githubFetch";
import IssuePage from "@/components/issue/IssuePage";
import { issuesData } from "@/content/issue";

type IssuePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Issue({ params }: IssuePageProps) {
  const { slug } = await params;

  const posts = await fetchArchivePosts();
  const issueMeta = issuesData.find((i) => i.slug === slug);

  if (!issueMeta) {
    return (
      <main style={{ padding: "4rem" }}>
        <h1>404 – Issue Not Found</h1>
        <p>No issue found for slug: {slug}</p>
      </main>
    );
  }

  const issuePosts = posts.filter(
    (p) => p.issue?.toLowerCase() === slug.toLowerCase()
  );

  return <IssuePage issueMeta={issueMeta} posts={issuePosts} />;
}
