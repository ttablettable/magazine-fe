import React from "react";
import styles from "./ActivityFeed.module.css";
import type { Activity } from "./activity.types";
import ActivityItem from "./ActivityItem";

interface ActivityFeedProps {
  items: Activity[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ items }) => {

  if (!items.length) {
    console.warn("[ActivityFeed] Empty activity list");
    return (
      <div className={styles.timeline}>
        <p className={styles.empty}>No activity yet.</p>
      </div>
    );
  }

  const sorted = [...items].sort((a, b) => {
    const aDate = a.date ? new Date(a.date).getTime() : 0;
    const bDate = b.date ? new Date(b.date).getTime() : 0;
    return bDate - aDate;
  });

  return (
    <div className={styles.timeline}>
      {sorted.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </div>
  );
};

export default ActivityFeed;
