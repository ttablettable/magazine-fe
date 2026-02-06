"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import styles from "./StoryPage.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { computeChangedBlockIndexes } from "@/lib/computeChangedLines";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/Dropdown";

import HighlightMenu from "@/components/ui/HighlightMenu";

import { useNotifications } from "@/hooks/useNotifications";
import NotificationHost from "@/components/ui/notifications/NotificationHost";

import AspectRatioImage from "@/components/ui/AspectRatioImage";

import { GitHubPost } from "@/utils/githubFetch";
import { issuesData } from "@/content/issue";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

import Image from "next/image";
import ReadingTool from "./ReadingTool";

import type { Revision } from "@/utils/fetchRevisions";
import { RevisionDropdown } from "@/components/revisions/RevisionDropdown";
import { ViewDiff } from "@/components/revisions/ViewDiff";
import AuthorList from "../AuthorList";

interface StoryPageProps {
  post: GitHubPost;
  relatedPosts: GitHubPost[];
  isRevision?: boolean;
  revisionSha?: string;
}

export default function StoryPage({
  post,
  relatedPosts,
  isRevision = false,
  revisionSha,
}: StoryPageProps) {
  const [isMetaVisible, setIsMetaVisible] = useState(false);

  const router = useRouter();

  const { notis, show, remove } = useNotifications();

  const articleRef = useRef<HTMLDivElement>(null);

  const toggleMetaVisibility = () => setIsMetaVisible(!isMetaVisible);

  const [previousContent, setPreviousContent] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleCopyCitation = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  function getSelectionRect() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    const rect = sel.getRangeAt(0).getBoundingClientRect();
    return rect;
  }

  const notifyCopied = (text: string, x: number, y: number) => {
    show({
      text,
      x,
      y,
      variant: "success",
    });
  };

  async function handleRevisionSelect(rev: Revision) {
    router.push(`/story/${post.slug}/${rev.sha}`);
  }

  function normalizeImageUrl(src: string): string {
    if (!src) return "";
    if (src.startsWith("http")) return src;
    if (src.startsWith("/uploads") || src.startsWith("uploads")) {
      return `/media/${src.replace(/^\/?uploads\//, "")}`;
    }
    return src;
  }

  useEffect(() => {
    if (isRevision) return;

    async function loadPreviousRevision() {
      try {
        const revRes = await fetch(
          `/api/revisions?folder=archive&slug=${post.slug}`
        );
        if (!revRes.ok) return;

        const revData = await revRes.json();
        const previous = revData.revisions?.[1];
        if (!previous) return;

        const params = new URLSearchParams({
          folder: "archive",
          slug: post.slug,
          sha: previous.sha,
        });

        const contentRes = await fetch(
          `/api/revision-content?${params.toString()}`
        );
        if (!contentRes.ok) return;

        const { text } = await contentRes.json();
        setPreviousContent(text);
      } catch (err) {
        console.error(err);
      }
    }

    loadPreviousRevision();
  }, [post.slug, isRevision]);

  const changedIndexes = useMemo(() => {
    if (!previousContent || isRevision) return null;

    const result = computeChangedBlockIndexes(previousContent, post.content);

    console.log("[StoryPage] changed block indexes:", [...result]);

    return result;
  }, [previousContent, post.content, isRevision]);

  const contentBlocks = useMemo(() => {
    return post.content.split("\n\n");
  }, [post.content]);

  const issueMeta = issuesData.find((i) => i.slug === post.issue);
  const issueColor = issueMeta?.color || "#000";

  // all posts in same issue except current one
  const siblings = relatedPosts
    .filter((p) => p.issue === post.issue && p.slug !== post.slug)
    .sort((a, b) => {
      const dateA = a.published ? new Date(a.published).getTime() : 0;
      const dateB = b.published ? new Date(b.published).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 3);

  const markdownSchema = {
    ...defaultSchema,

    tagNames: [
      ...(defaultSchema.tagNames || []),
      "figure",
      "figcaption",
      "span",
      "div",
    ],

    attributes: {
      ...defaultSchema.attributes,

      span: ["class", "data-revision", "data-auto-revision"],

      figure: [
        ...(defaultSchema.attributes?.figure || []),
        "className",
        "class",
        "data-rt-type",
        "data-rt-align",
      ],

      figcaption: [
        ...(defaultSchema.attributes?.figcaption || []),
        "className",
        "class",
      ],
    },
  };

  const paragraphIndexRef = useRef(0);

  useEffect(() => {
    paragraphIndexRef.current = 0;
  }, [post.content, isRevision]);

  const renderedBlocks = useMemo(() => {
    if (!changedIndexes || isRevision) {
      return post.content.split("\n\n").map((block, i) => ({
        block,
        isChanged: false,
        index: i,
      }));
    }

    return post.content.split("\n\n").map((block, i) => ({
      block,
      isChanged: changedIndexes.has(i),
      index: i,
    }));
  }, [post.content, changedIndexes, isRevision]);

  const markdownComponents = {
    h1: (props: any) => <h1 className={styles.h1} {...props} />,
    h2: (props: any) => <h2 className={styles.h2} {...props} />,
    p: (props: any) => <p className={styles.p} {...props} />,

    a: (props: any) => (
      <a
        {...props}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
      />
    ),

    figure: ({ children }: any) => (
      <figure className={styles.figure}>{children}</figure>
    ),

    img: ({ node, ...props }: any) => {
      const parent = node?.parent;
      if (parent?.tagName === "figure") return <img {...props} />;

      const src = normalizeImageUrl(props.src || "");
      return (
        <div className={styles.imageWrapper}>
          <Image
            src={src}
            alt={props.alt || ""}
            width={800}
            height={600}
            className={styles.image}
          />
          {props.alt && (
            <figcaption className={styles.caption}>{props.alt}</figcaption>
          )}
        </div>
      );
    },
  };

  return (
    <div className={styles.page}>
      <ReadingTool
        onCopy={(url) => {
          handleCopy(url);
          notifyCopied("Copied", window.innerWidth / 2 - 40, 80);
        }}
      />

      <div className={styles.main}>
        {isRevision && revisionSha && (
          <div className={styles.revisionBanner}>
            <span>
              Viewing archived revision <code>{revisionSha}</code>
            </span>
            <Link
              href={`/story/${post.slug}`}
              className={styles.revisionBackLink}
            >
              View latest
            </Link>
          </div>
        )}
        <div className={styles.header}>
          <div className={styles.cover}>
            <AspectRatioImage
              src={post.keyImage || ""}
              alt={post.headline}
              ratio={16 / 9}
              className={styles.mainImg}
            />
          </div>

          <div>
            <h1>{post.headline}</h1>
          </div>

          <div className={styles.meta}>
            <div className={styles.metaIn}>
              <div><span>
                <b>Written by: </b>
              </span>
              <span>
                  <AuthorList authors={post.authors} />
              </span>{" "}</div>
              <span className={styles.issue}>
                for the{" "}
                <Link
                  href={`/issue/${post.issue}`}
                  className={styles.issueLabel}
                >
                  {issueMeta?.title}
                </Link>{" "}
                issue.
              </span>
            </div>

            <div className={styles.metaIn}>
              <div>
                <div>
                  <span>
                    <b>Originally published: </b>
                  </span>
                  <span>
                    {post.published
                      ? new Date(post.published).toLocaleDateString()
                      : "—"}
                  </span>
                </div>
                <div>
                  <span>
                    <b>Last updated: </b>
                  </span>
                  <span>
                    {new Date(post.lastModified).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <RevisionDropdown
                    folder="archive"
                    slug={post.slug}
                    onSelectRevision={handleRevisionSelect}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Highlight menu */}
        {!isRevision && (
          <HighlightMenu
            targetRef={articleRef}
            renderMenu={({ selectedText, closeMenu }) => (
              <div className={styles.menu}>
                {/* Close */}
                <button
                  className={`${styles.button} ${styles.closeButton}`}
                  onClick={closeMenu}
                >
                  <img src="/asterisk.svg" width="15" height="15" alt="" />
                </button>

                {/* Copy & Notify */}
                <button
                  className={`${styles.button} ${styles.copyButton}`}
                  onClick={() => {
                    // 1. Capture rect BEFORE copying OR closing menu
                    const rect = getSelectionRect();

                    // 2. Build citation
                    const today = new Date();
                    const formattedDate = today.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });

                    const citation = `"${selectedText}" - Table Quarterly, ${formattedDate}`;

                    // 3. Actually copy
                    handleCopyCitation(citation);

                    // 4. Fire notification using SAVED RECT
                    if (rect) {
                      const x = rect.left + rect.width / 2 + window.scrollX;
                      const y = rect.top - 20 + window.scrollY;

                      notifyCopied("Copied", x, y);
                    }

                    // 5. Close menu AFTER firing notif (it won’t break the rect)
                    closeMenu();
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24">
                    <path d="M18 6v-6h-18v18h6v6h18v-18h-6zm-12 10h-4v-14h14v4h-10v10zm16 6h-14v-14h14v14z" />
                  </svg>
                </button>

                {/* Google search */}
                <button
                  className={`${styles.button} ${styles.searchButton}`}
                  onClick={() => {
                    window.open(
                      `https://www.google.com/search?q=${selectedText}`
                    );
                    closeMenu();
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24">
                    <path d="M23.822 20.88l-6.353-6.354c.93-1.465 1.467-3.2 1.467-5.059.001-5.219-4.247-9.467-9.468-9.467s-9.468 4.248-9.468 9.468c0 5.221 4.247 9.469 9.468 9.469 1.768 0 3.421-.487 4.839-1.333l6.396 6.396 3.119-3.12zm-20.294-11.412c0-3.273 2.665-5.938 5.939-5.938 3.275 0 5.94 2.664 5.94 5.938 0 3.275-2.665 5.939-5.94 5.939-3.274 0-5.939-2.664-5.939-5.939z" />
                  </svg>
                </button>
              </div>
            )}
          />
        )}
        <article className={`${styles.article} ${styles.wrapper}`}>
          <hr />

          {renderedBlocks.map(({ block, isChanged, index }) => {
            if (isChanged) {
              console.log("[StoryPage] rendering changed block", index);
            }

            return (
              <div
                key={index}
                className={isChanged ? styles.inlineRevision : undefined}
                data-auto-revision={isChanged ? "true" : undefined}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, [rehypeSanitize, markdownSchema]]}
                  components={markdownComponents}
                >
                  {block}
                </ReactMarkdown>
              </div>
            );
          })}
        </article>

        <div className={styles.storyFooter}>
          <div className={styles.storyMetaCard}>
            <p>
              Written by <AuthorList authors={post.authors} /> for the{" "}
              <Link
                href={`/issue/${post.issue}`}
                className={styles.storyIssue}
                style={{ "--issue-color": issueColor } as React.CSSProperties}
              >
                {issueMeta?.title}
              </Link>{" "}
              issue.
            </p>
          </div>
          {!isRevision && (
            <div className={styles.storyReadMore}>
              <p>Read more from this issue</p>
              <div className={styles.readMoreGrid}>
                {siblings.length > 0 ? (
                  siblings.map((rp) => (
                    <Link
                      key={rp.slug}
                      href={`/story/${rp.slug}`}
                      className={styles.readMoreCard}
                    >
                      <AspectRatioImage
                        src={
                          rp.keyImage || "https://via.placeholder.com/400x250"
                        }
                        alt={rp.headline}
                        ratio={4 / 3}
                      />
                      <div className={styles.footerByline}>
                        <AuthorList authors={rp.authors} />
                      </div>
                      <h3>{rp.headline}</h3>
                    </Link>
                  ))
                ) : (
                  <p>No other stories in this issue yet.</p>
                )}
              </div>
            </div>
          )}
          <div className={styles.storySupport}>
            <p>
              Do stories and artists like this matter to you?{" "}
              <Link href={"/support"}>Become a friend of Table Quarterly</Link>{" "}
              and support independent arts publishing. Join a community of
              like-minded readers who are passionate about contemporary art, and
              get exclusive access to interviews, partner discounts, and event
              tickets.
            </p>
          </div>
        </div>
      </div>

      {/* Notification System */}
      <NotificationHost notis={notis} remove={remove} />
    </div>
  );
}
