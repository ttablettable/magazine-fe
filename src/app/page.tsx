import styles from "./page.module.css";
import Footer from "@/components/layout/Footer";
import Navigation from "@/components/navigation/Navigation";
import Feed from "@/components/feed/Feed";
import BlockquoteCarousel from "@/components/BlockquoteCarousel";
import Link from "next/link";

import { fetchArchivePosts } from "@/utils/githubFetch";
import { getAllQuotes } from "@/lib/getAllQuotes";

export default async function Home() {
  const posts = await fetchArchivePosts();
  const quotes = getAllQuotes(posts);

  return (
    <div className={styles.page}>
      <Navigation />
      <main className={styles.main}>
        {quotes.length > 0 && (
          <BlockquoteCarousel quotes={quotes} />
        )}
        <Feed posts={posts} />
      </main>
      <Footer />
    </div>
  );
}
