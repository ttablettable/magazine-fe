import Link from "next/link";
import styles from "./Feed.module.css";
import { GitHubPost } from "@/utils/githubFetch";

import AspectRatioImage from "../ui/AspectRatioImage";

interface FeedItemProps {
  post: GitHubPost;
}

export default function FeedItem({ post }: FeedItemProps) {
  return (
    <div className={styles.fullItem}>
      <Link href={`/story/${post.slug}`}>
        <div className={styles.cover}>
          <AspectRatioImage
            src="https://via.placeholder.com/450x300"
            alt={post.headline}
            ratio={16 / 9}
            className={styles.mainImg}
          />
        </div>

        <article className={styles.post}>
          <h2>{post.headline}</h2>

          <p className={styles.intro}>{post.intro}</p>

          <div className={styles.meta}>
            {post.published && (
              <time className={styles.date}>
                {new Date(post.published).toLocaleDateString()}
              </time>
            )}
            {post.authors.length > 0 && (
              <p className={styles.authors}>
                Written by: {" "}
                <Link href="/people/${post.authors}">
                  {" "}
                  {post.authors.join(", ")}
                </Link>
              </p>
            )}
          </div>
        </article>
      </Link>
    </div>
  );
}
