import styles from "./Feed.module.css";
import FeedItem from "./FeedItem";
import { GitHubPost } from "@/utils/githubFetch";

interface FeedProps {
  posts: GitHubPost[];
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