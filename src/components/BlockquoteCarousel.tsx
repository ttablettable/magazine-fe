"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
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
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);

  // Auto-advance
  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % quotes.length);
    }, 6000);
    return () => clearInterval(id);
  }, [quotes.length, isPaused]);

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
          <div key={i} className={styles.slide}>
            <Link href={`/story/${q.slug}`} className={styles.slideLink}>
              <blockquote className={styles.quote}>{q.text}</blockquote>
              <div className={styles.meta}>
                <div className={styles.title}>{q.headline}</div>
              </div>
            </Link>

            {q.issue && (
              <Link
                href={`/issue/${q.issue}`}
                className={styles.issueButton}
                style={{
                  backgroundColor: getIssueColor(q.issue),
                  color: getContrastColor(getIssueColor(q.issue)),
                }}
              >
                #{q.issue}
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className={styles.pagination}>
        <button
          type="button"
          className={styles.arrowButton}
          onClick={() => setIndex((i) => (i - 1 + quotes.length) % quotes.length)}
          aria-label="Previous slide"
        >
          ‹
        </button>

        {quotes.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === index ? styles.active : ""}`}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
          />
        ))}

        <button
          type="button"
          className={styles.arrowButton}
          onClick={() => setIndex((i) => (i + 1) % quotes.length)}
          aria-label="Next slide"
        >
          ›
        </button>

        <button
          type="button"
          className={styles.pauseButton}
          onClick={() => setIsPaused((p) => !p)}
          aria-label={
            isPaused ? "Resume auto-advancing slides" : "Pause auto-advancing slides"
          }
        >
          {isPaused ? "Play" : "Pause"}
        </button>
      </div>
    </div>
  );
}
