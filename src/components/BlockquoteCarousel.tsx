"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./BlockquoteCarousel.module.css";

import { issuesData } from "@/content/issue";
import { getContrastColor } from "@/lib/getContrastColor";

interface Quote {
  slug: string;
  text: string;
  headline: string;
  issue: string | null;
}

export default function BlockquoteCarousel({ quotes }: { quotes: Quote[] }) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);

  // Auto-advance
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % quotes.length);
    }, 6000);
    return () => clearInterval(id);
  }, [quotes.length]);

  // Slide effect
  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${index * 100}%)`;
    }
  }, [index]);

  // Tap/swipe
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let startX = 0;
    let endX = 0;

    const start = (e: TouchEvent) => (startX = e.touches[0].clientX);
    const move = (e: TouchEvent) => (endX = e.touches[0].clientX);
    const end = () => {
      const delta = endX - startX;
      if (delta > 50) setIndex((i) => (i - 1 + quotes.length) % quotes.length);
      if (delta < -50) setIndex((i) => (i + 1) % quotes.length);
    };

    track.addEventListener("touchstart", start);
    track.addEventListener("touchmove", move);
    track.addEventListener("touchend", end);

    return () => {
      track.removeEventListener("touchstart", start);
      track.removeEventListener("touchmove", move);
      track.removeEventListener("touchend", end);
    };
  }, [quotes.length]);

  function getIssueColor(issueSlug: string | null) {
    if (!issueSlug) return "#ccc"; // default fallback
    const issue = issuesData.find((i) => i.slug === issueSlug);
    return issue?.color || "#ccc";
  }

  return (
    <div className={styles.carousel}>
      <div className={styles.track} ref={trackRef}>
        {quotes.map((q, i) => (
          <div
            key={i}
            className={styles.slide}
            onClick={() => router.push(`/story/${q.slug}`)}
          >
            <blockquote className={styles.quote}>{q.text}</blockquote>

            <div className={styles.meta}>
              <div className={styles.title}>{q.headline}</div>

              {q.issue && (
                <div
                  className={styles.issueButton}
                  style={{
                    backgroundColor: getIssueColor(q.issue),
                    color: getContrastColor(getIssueColor(q.issue)),
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/issue/${q.issue}`);
                  }}
                >
                  #{q.issue}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        {quotes.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === index ? styles.active : ""}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
