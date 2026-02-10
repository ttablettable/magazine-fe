import Feed from "@/components/feed/Feed";
import HotEmpty from "@/components/HotEmpty";
import { fetchArchivePosts, GitHubPost } from "@/utils/githubFetch";
import { getMostReadSlugs, MostReadItem } from "@/lib/clicky";

export default async function Hot() {
  const posts: GitHubPost[] = await fetchArchivePosts();
  const mostRead: MostReadItem[] = await getMostReadSlugs();

  const postMap = new Map<string, GitHubPost>(
    posts.map((post) => [post.slug, post])
  );

  const mostReadPosts: GitHubPost[] = mostRead
    .map((mr) => postMap.get(mr.slug))
    .filter((post): post is GitHubPost => Boolean(post));

  if (mostReadPosts.length === 0) {
    return (
      <div
        style={{
          marginTop: "60px",
          marginBottom: "var(--margin-bottom)",
          background: "var(--white)",
          padding: "2rem",
          textAlign: "center",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>
          Most Read (Last 7 Days)
        </h2>
        
        <HotEmpty />
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: "60px",
        marginBottom: "var(--margin-bottom)",
        background: "var(--white)",
        paddingBottom: "0.2rem",
      }}
    >
      <Feed posts={mostReadPosts} />
    </div>
  );
}
