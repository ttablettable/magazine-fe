import styles from "./Feed.module.css";
import FeedItem from "./FeedItem";
import type { GitHubPost } from "@/lib/storyTypes";

interface FeedProps {
  posts: (GitHubPost & {
    views?: number;
    trend?: number;
  })[];
}

export default function Feed({ posts }: FeedProps) {
  return (
    <div className={styles.feed}>
      {posts.map((post) => (
        <FeedItem key={post.slug} post={post} />
      ))}
    </div>
  );
}
