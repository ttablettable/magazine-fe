import React from "react";
import Link from "next/link";

import styles from "./ActivityFeed.module.css";
import { ACTIVITY_META } from "./activity.meta";
import type { Activity } from "./activity.types";

import { issuesData } from "@/content/issue";

interface ActivityItemProps {
  activity: Activity;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const meta = ACTIVITY_META[activity.type];

  if (!meta) {
    console.warn("[ActivityItem] No meta for activity type:", activity.type);
    return null;
  }

  const issueMeta = issuesData.find((i) => i.slug === activity.issue);

  const issueColor = issueMeta?.color || "#000";

  if (activity.type === "authored") {
    const { title, storySlug, issue, date } = activity;

    return (
      <div className={styles.timelineItem}>
        <div
          className={`${styles.timelineDot} ${
            styles[`timelineDot-${meta.color}`]
          }`}
        >
          <div className={styles.defaultDot} />
        </div>

        <div className={styles.timelineContent}>
          <span>Authored </span>

          {storySlug ? (
            <Link href={`/story/${storySlug}`} className={styles.storyTitle}>
              <strong>{title}</strong>
            </Link>
          ) : (
            <strong>{title}</strong>
          )}

          {issue && (
            <>
              {" "}
              in{" "}
              <Link
                href={`/issue/${issue}`}
                className={styles.issue}
                style={{ "--issue-color": issueColor } as React.CSSProperties}
              >
                #{issue}
              </Link>
            </>
          )}

          {date && (
            <span className={styles.dates}>
              {new Date(date).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default ActivityItem;
