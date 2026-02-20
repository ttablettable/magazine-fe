"use client";

import Link from "next/link";
import styles from "./Feed.module.css";
import { GitHubPost } from "@/lib/githubFetch";
import AuthorList from "../AuthorList";
import AspectRatioImage from "../ui/AspectRatioImage";
import { motion } from "framer-motion";

interface FeedItemProps {
  post: GitHubPost & {
    views?: number;
    trend?: number;
  };
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
          <h2>
            {post.headline}
            {post.views !== undefined && (
              <span
                style={{
                  fontSize: "0.9rem",
                  color: "var(--green)",
                  marginLeft: "0.5rem",
                }}
              >
                {post.trend && post.trend > 0 ? " ↑" : ""}
              </span>
            )}
          </h2>
        </Link>

        <Link href={`/story/${post.slug}`}>
          <motion.p
            className={styles.intro}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {post.intro}
          </motion.p>
        </Link>

        <div className={styles.meta}>
          <div className={styles.metaLine}>
            {post.authors.length > 0 && (
              <>
                <AuthorList authors={post.authors} />
                {post.published && ", "}
              </>
            )}

            {post.published ? (
              <>
                <time>
                  {new Date(post.published).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>

                {post.lastModified &&
                  post.published &&
                  new Date(post.lastModified).toDateString() !==
                    new Date(post.published).toDateString() && (
                    <>
                      {" · Updated "}
                      <time>
                        {new Date(post.lastModified).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </time>
                    </>
                  )}
              </>
            ) : post.lastModified ? (
              <time>
                {new Date(post.lastModified).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            ) : null}
          </div>
        </div>
      </article>
    </div>
  );
}
