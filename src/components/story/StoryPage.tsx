"use client";

import React, { useState, useRef } from "react";
import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/layout/Footer";
import styles from "./StoryPage.module.css";
import ShareBox from "@/components/Share";
import Link from "next/link";

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

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import Image from "next/image";

interface StoryPageProps {
  post: GitHubPost;
}

export default function StoryPage({ post }: StoryPageProps) {
  const [isMetaVisible, setIsMetaVisible] = useState(false);

  const { notis, show, remove } = useNotifications();

  const articleRef = useRef<HTMLDivElement>(null);

  const toggleMetaVisibility = () => setIsMetaVisible(!isMetaVisible);

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

  const placeholderCommits = [
    "Initial commit",
    "Added new section",
    "Fixed typos",
    "Updated formatting",
    "Final version",
  ];

  function normalizeImageUrl(src: string): string {
    if (!src) return "";
    if (src.startsWith("http")) return src;
    if (src.startsWith("/uploads") || src.startsWith("uploads")) {
      return `/media/${src.replace(/^\/?uploads\//, "")}`;
    }
    return src;
  }

  return (
    <div className={styles.page}>
      <Navigation />
      <ShareBox />

      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.cover}>
            <AspectRatioImage
              src="https://via.placeholder.com/450x300"
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
              <span>
                <b>Written by: </b>
              </span>
              <span>
                {post.authors.length > 0
                  ? post.authors.join(", ")
                  : "Unknown Author"}
              </span>
            </div>

            <div className={styles.metaIn}>
              <span>
                <b>Originally published: </b>
              </span>
              <span>
                {post.published
                  ? new Date(post.published).toLocaleDateString()
                  : "—"}
              </span>
            </div>

            <div className={styles.metaIn}>
              <span>
                <b>Last updated: </b>
              </span>
              <span>{new Date(post.lastModified).toLocaleDateString()}</span>
            </div>
          </div>

          <div
            className={styles.metaBlock}
            style={{ opacity: isMetaVisible ? 1 : 0 }}
          >
            <p>
              <b>Token ID:</b> 31
            </p>
            <p>
              <b>Block:</b> 21590383
            </p>
            <p>
              <b>Tx:</b>{" "}
              0x7cd59f3eacaf47c12321a918bbb1e34eafda26cf7ccfb7dda54d811aff932c9b
            </p>
          </div>

          <div className={styles.share}>
            <button id="blockInfo" onClick={toggleMetaVisibility}>
              <img src="/kebab.svg" width="15" height="15" alt="" />
            </button>

            {/* URL Copy Button */}
            <button
              id="copyButton"
              onClick={() => {
                handleCopy(window.location.href);

                notifyCopied("Copied", window.innerWidth / 2 - 40, 80);
              }}
            >
              <img src="/link.svg" width="15" height="15" alt="" />
            </button>

            <button id="mintButton">
              <svg width="15" height="15" viewBox="0 0 1001 1001">
                <path
                  d="M500.137 0.523193C224.003 0.523193 0.136597 224.39 0.136597 500.523C0.136597 776.656 224.003 1000.52 500.137 1000.52C776.27 1000.52 1000.14 776.656 1000.14 500.523C1000.14 224.39 776.27 0.523193 500.137 0.523193ZM500.137 909.756C274.137 909.756 90.9033 726.523 90.9033 500.523C90.9033 274.523 274.137 91.2899 500.137 91.2899C726.137 91.2899 909.37 274.523 909.37 500.523C909.37 726.523 726.137 909.756 500.137 909.756Z"
                  fill="black"
                />
                <path
                  d="M546.27 454.39V180.557H454.003V454.39H180.17V546.657H454.003V820.49H546.27V546.657H820.103V454.39H546.27Z"
                  fill="black"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Highlight menu */}
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

        <article ref={articleRef} className={styles.article}>
          <hr />

          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            components={{
              h1: ({ node, ...props }) => (
                <h1 className={styles.h1} {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className={styles.h2} {...props} />
              ),
              p: ({ node, ...props }) => <p className={styles.p} {...props} />,
              a: ({ node, ...props }) => (
                <a
                  {...props}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                />
              ),
              img: ({ node, ...props }) => (
                <div className={styles.imageWrapper}>
                  <Image
                    src={normalizeImageUrl(props.src || "")}
                    alt={props.alt || ""}
                    width={800}
                    height={600}
                    className={styles.image}
                  />
                  {props.alt && (
                    <figcaption className={styles.caption}>
                      {props.alt}
                    </figcaption>
                  )}
                </div>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </article>
      </main>

      <Footer />

      {/* Notification System */}
      <NotificationHost notis={notis} remove={remove} />
    </div>
  );
}
