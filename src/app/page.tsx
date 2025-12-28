import styles from "./page.module.css";
import Footer from "@/components/layout/Footer";
import Feed from "@/components/feed/Feed";
import BlockquoteCarousel from "@/components/BlockquoteCarousel";
import Link from "next/link";

import { fetchArchivePosts } from "@/utils/githubFetch";
import { getAllQuotes } from "@/lib/getAllQuotes";

export default async function Home() {
  const posts = await fetchArchivePosts();
  const quotes = getAllQuotes(posts);

  return (
      <div className={styles.main}>
        <div className={styles.header}>
          <h1>Table</h1>
          <h2>Quarterly</h2>
          <p>Stories, criticism, and experiments in art. Revised in public.</p>
        </div>
        {quotes.length > 0 && (
          <BlockquoteCarousel quotes={quotes} />
        )}
        <Feed posts={posts} />
      </div>
  );
}
