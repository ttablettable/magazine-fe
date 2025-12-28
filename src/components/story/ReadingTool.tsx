import React from "react";
import Link from "next/link";
import styles from "./StoryPage.module.css";
import Share from "@/components/Share";
import OnchainBox from "@/components/OnchainBox";

const ReadingTool: React.FC<{ onCopy?: (url: string) => void }> = ({
  onCopy,
}) => {
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className={styles.readingContainer}>
      <OnchainBox />
      <Share onCopy={onCopy} />
    </div>
  );
};

export default ReadingTool;
