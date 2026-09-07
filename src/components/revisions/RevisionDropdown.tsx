"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Revision } from "@/lib/storyTypes";
import styles from "./page.module.css";

interface RevisionDropdownProps {
  storyId: string;
  slug: string;
  onSelectRevision: (rev: Revision) => void;
}

interface ApiResponse {
  revisions: Revision[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}

export function RevisionDropdown({
  storyId,
  slug,
  onSelectRevision,
}: RevisionDropdownProps) {
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [pageInfo, setPageInfo] = useState({
    hasNextPage: false,
    endCursor: null as string | null,
  });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);

  async function loadRevisions(cursor?: string | null) {
    if (!storyId) return;
    setLoading(true);
    setError(false);
    try {
      const params = new URLSearchParams();
      if (cursor) params.set("cursor", cursor);

      const res = await fetch(
        `/api/stories/${storyId}/revisions?${params.toString()}`,
      );
      if (!res.ok) throw new Error("Failed to load revisions");

      const data: ApiResponse = await res.json();

      setRevisions((prev) =>
        cursor ? [...prev, ...data.revisions] : data.revisions
      );
      setPageInfo(data.pageInfo);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!storyId) return;

    if (open && revisions.length === 0) {
      void loadRevisions();
    }
  }, [open, revisions.length, storyId]);

  const router = useRouter();

  return (
    <div className={styles.revisionDropdown}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={styles.revisionToggle}
      >
        {open ? "Hide revisions" : "Show revisions"}
      </button>

      {open && (
        <div className={styles.revisionList}>
          {error && (
            <div className={styles.revisionError} role="alert">
              <span>Unable to load revisions.</span>
              <button
                type="button"
                onClick={() => loadRevisions()}
                className={styles.revisionRetry}
              >
                Try again
              </button>
            </div>
          )}

          {revisions.map((rev) => {
            const dateStr = rev.date.slice(0, 10).replace(/-/g, "");
            const label = `(${rev.shortSha}-${dateStr}) ${rev.message}`;

            return (
              <button
                key={rev.sha}
                type="button"
                className={styles.revisionItem}
                title={label}
                onClick={() => {
                  router.push(`/story/${slug}/${rev.revisionSha}`);
                }}
              >
                {label}
              </button>
            );
          })}

          {pageInfo.hasNextPage && (
            <button
              type="button"
              onClick={() => loadRevisions(pageInfo.endCursor)}
              disabled={loading}
              className={styles.revisionLoadMore}
            >
              {loading ? "Loading…" : "Load older revisions"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
