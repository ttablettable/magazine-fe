import { fetchArchivePosts, fetchLivePosts } from "@/lib/githubFetch";
import AuthorPage from "@/components/people/AuthorPage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: authorSlug } = await params;

  const [livePosts, archivePosts] = await Promise.all([
    fetchLivePosts(),
    fetchArchivePosts(),
  ]);

  return (
    <AuthorPage
      authorSlug={authorSlug}
      livePosts={livePosts}
      archivePosts={archivePosts}
    />
  );
}
