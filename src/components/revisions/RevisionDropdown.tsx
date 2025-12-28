"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Revision } from "@/utils/fetchRevisions";
import styles from "./page.module.css";

interface RevisionDropdownProps {
  folder: "live" | "archive";
  slug: string;
  onSelectRevision: (rev: Revision) => void;
}

interface ApiResponse {
  revisions: Revision[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}

export function RevisionDropdown({
  folder,
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

  async function loadRevisions(cursor?: string | null) {
    setLoading(true);
    try {
      const params = new URLSearchParams({ folder, slug });
      if (cursor) params.set("cursor", cursor);

      const res = await fetch(`/api/revisions?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load revisions");

      const data: ApiResponse = await res.json();

      setRevisions((prev) =>
        cursor ? [...prev, ...data.revisions] : data.revisions
      );
      setPageInfo(data.pageInfo);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open && revisions.length === 0) {
      void loadRevisions();
    }
  }, [open]);

  const router = useRouter();

  return (
    <div className={styles.revisionDropdown}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={styles.revisionToggle}
      >
        {open ? "Hide revisions" : "Revision history"}
      </button>

      {open && (
        <div className={styles.revisionList}>
          {revisions.map((rev) => {
            const dateStr = rev.date.slice(0, 10).replace(/-/g, "");
            const label = `(${rev.shortSha}-${dateStr}) ${rev.message}`;

            return (
              <button
                key={rev.sha}
                type="button"
                className={styles.revisionItem}
                onClick={() => {
                  router.push(`/story/${slug}/${rev.shortSha}`);
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
