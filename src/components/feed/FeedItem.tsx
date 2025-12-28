import Link from "next/link";
import styles from "./Feed.module.css";
import { GitHubPost } from "@/utils/githubFetch";
import AuthorList from "../AuthorList";
import AspectRatioImage from "../ui/AspectRatioImage";

interface FeedItemProps {
  post: GitHubPost;
}

export default function FeedItem({ post }: FeedItemProps) {
  return (
    <div className={styles.fullItem}>
      <div className={styles.cover}>
        <Link href={`/story/${post.slug}`}>
          <AspectRatioImage
            src={post.keyImage || "https://via.placeholder.com/150"}
            alt={post.headline}
            ratio={5 / 4}
            className={styles.mainImg}
          />
        </Link>
      </div>

      <article className={styles.post}>
        <Link href={`/story/${post.slug}`}>
          <h2>{post.headline}</h2>
        </Link>
        <div className={styles.meta}>
          {post.published && (
            <time className={styles.date}>
              {new Date(post.published).toLocaleDateString()}
            </time>
          )}
          {post.authors.length > 0 && (
            <p className={styles.authors}>
              <AuthorList authors={post.authors} />
            </p>

          )}
        </div>
        <Link href={`/story/${post.slug}`}>
          <p className={styles.intro}>{post.intro}</p>
        </Link>
      </article>
    </div>
  );
}
