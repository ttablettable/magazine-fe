import Feed from "@/components/feed/Feed";

import { fetchArchivePosts } from "@/utils/githubFetch";

export default async function Picks() {
  const posts = await fetchArchivePosts();

  const featured = posts.filter(
    (post) => post.featured === true
  );

  return (
    <div style={{ 
      marginTop: "60px",
      marginBottom: "var(--margin-bottom)",
      background: "var(--white)",
      paddingBottom: "0.2rem",
    }}>
      <Feed posts={featured} />
    </div>
  );
}
