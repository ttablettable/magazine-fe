import Feed from "@/components/feed/Feed";

import { fetchArchivePosts } from "@/utils/githubFetch";

export default async function Picks() {
  const posts = await fetchArchivePosts();

  const featured = posts.filter(
    (post) => post.featured === true
  );

  return (
    <div style={{ marginTop: "60px" }}>
      <Feed posts={featured} />
    </div>
  );
}
