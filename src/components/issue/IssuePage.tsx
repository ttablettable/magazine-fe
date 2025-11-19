"use client";
import React from "react";
import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/layout/Footer";
import styles from "./IssuePage.module.css";
import Link from "next/link";
import { IssueMeta } from "@/content/issue";

type Post = {
  slug: string;
  headline: string;
  intro?: string;
  authors: string[];
  issue?: string;
  channel?: string;
};

interface IssuePageProps {
  issueMeta: IssueMeta;
  posts: Post[];
}

const IssuePage: React.FC<IssuePageProps> = ({ issueMeta, posts }) => {
  if (!issueMeta) return <div>Issue not found.</div>;
  if (posts.length === 0)
    return (
      <div className={styles.page}>
        <Navigation />
        <main className={styles.main}>
          <h1>Loading {issueMeta.title}...</h1>
        </main>
        <Footer />
      </div>
    );

  const cover = posts.find((p) => p.channel === "cover");
  const interviews = posts.filter((p) => p.channel === "interview");
  const essays = posts.filter((p) => p.channel === "idea");
  const columns = posts.filter((p) => p.channel === "column");

  return (
    <div className={styles.page}>
      <Navigation />

      <main className={styles.main}>
        {/* HEADER */}
        <div
          className={styles.title}
          style={{ backgroundColor: issueMeta.color }}
        >
          <div>
            <h1>{issueMeta.title}</h1>
            <h4>Issue No. {issueMeta.number ?? issueMeta.edition}</h4>
            <blockquote>
              <p>“{issueMeta.quote}”</p>
            </blockquote>
            {issueMeta.source && <cite>— {issueMeta.source}</cite>}
          </div>
        </div>

        {/* COVER STORY */}
        {cover && (
          <section id="cover" className={styles.cover}>
            <h2>Cover Story</h2>
            <article>
              <Link href={`/story/${cover.slug}`}>
                <h3>{cover.headline}</h3>
              </Link>
              {cover.intro && <p className={styles.excerpt}>{cover.intro}</p>}
              {cover.authors?.length > 0 && (
                <p>
                  Written by{" "}
                  <Link href={`/people/${cover.authors[0]}`}>
                    {cover.authors[0].replace(/-/g, " ")}
                  </Link>
                </p>
              )}
            </article>
          </section>
        )}

        {/* TABLE OF CONTENTS */}
        <div className={styles.header}>
          <h2>Index</h2>
          <div className={styles.grid}>
            {posts.map((story) => (
              <div key={story.slug} className={styles.story}>
                <h4>{story.channel}</h4>
                <h3>
                  <Link href={`/story/${story.slug}`}>{story.headline}</Link>
                </h3>
                {story.authors?.length > 0 && (
                  <p>
                    Written by{" "}
                    <Link href={`/people/${story.authors[0]}`}>
                      {story.authors[0].replace(/-/g, " ")}
                    </Link>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* INTERVIEWS */}
        {interviews.length > 0 && (
          <section id="interviews" className={styles.interviews}>
            <h2>Interviews</h2>
            <div className={styles.intGroup}>
              {interviews.map((post) => (
                <article key={post.slug}>
                  <Link href={`/story/${post.slug}`}>
                    <h3>{post.headline}</h3>
                  </Link>
                  {post.authors?.length > 0 && (
                    <p>
                      Written by{" "}
                      <Link href={`/people/${post.authors[0]}`}>
                        {post.authors[0].replace(/-/g, " ")}
                      </Link>
                    </p>
                  )}
                  {post.intro && <p>{post.intro}</p>}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* IDEAS */}
        {essays.length > 0 && (
          <section id="essays" className={styles.essays}>
            <h2>Ideas</h2>
            <div className={styles.essay}>
              {essays.map((post) => (
                <article key={post.slug}>
                  <Link href={`/story/${post.slug}`}>
                    <h3>{post.headline}</h3>
                  </Link>
                  {post.authors?.length > 0 && (
                    <p>
                      Written by{" "}
                      <Link href={`/people/${post.authors[0]}`}>
                        {post.authors[0].replace(/-/g, " ")}
                      </Link>
                    </p>
                  )}
                  {post.intro && <p className={styles.excerpt}>{post.intro}</p>}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* COLUMNS */}
        {columns.length > 0 && (
          <section id="columns" className={styles.columns}>
            <h2>Columns</h2>
            <div className={styles.column}>
              {columns.map((post) => (
                <article key={post.slug}>
                  <Link href={`/story/${post.slug}`}>
                    <h3>{post.headline}</h3>
                  </Link>
                  {post.authors?.length > 0 && (
                    <p>
                      Written by{" "}
                      <Link href={`/people/${post.authors[0]}`}>
                        {post.authors[0].replace(/-/g, " ")}
                      </Link>
                    </p>
                  )}
                  {post.intro && <p className={styles.excerpt}>{post.intro}</p>}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* FINE PRINT */}
        <div className={styles.fineprint}>
          <p>
            TTABLE is licensed under a <Link href="http://creativecommons.org/licenses/by-nc/4.0/" target="_blank">Creative Commons Attribution–Non
            Commercial 4.0 International License</Link> that allows readers to read,
            download, copy, distribute, print, search, or link to the full texts
            of its articles and allow readers to use them for any other lawful
            purpose.
          </p>
          <p>
            <strong>ISSN 2375-4982</strong>
          </p>
          <h6>Contribute</h6>
          <p>
            <Link href="/submissions">Submissions</Link>
          </p>
          <p>
            TTABLE is published independently by{" "}
            <Link href="https://wearecobalt.net" target="_blank">
              Cobalt
            </Link>
            , dedicated to lowering the barrier to entry in the art industry.
          </p>
          <p>
            <strong>Typeface:</strong>{" "}
            <Link href="" target="_blank">
              EB Garamond
            </Link>
            ,{" "}
            <Link href="" target="_blank">
              Playfair Display
            </Link>
            , Franklin Gothic Medium
          </p>
          <p>
            <strong>Content Management:</strong> Brian Felix
          </p>
          <p>
            <strong>Editorial Design:</strong> Cobalt
          </p>
          <p>
            <strong>Web Development:</strong> Cobalt
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default IssuePage;
