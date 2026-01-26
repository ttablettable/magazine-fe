"use client";

import React, { useEffect, useState } from "react";
import OnchainBox from "@/components/OnchainBox";
import Share from "@/components/Share";
import styles from "./StoryPage.module.css";

const ReadingTool: React.FC<{ onCopy?: (url: string) => void }> = ({ onCopy }) => {
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  if (!currentUrl) return null;

  return (
    <div className={styles.readingContainer}>
      {/* <OnchainBox /> */}
      <Share url={currentUrl} onCopy={onCopy} />
    </div>
  );
};

export default ReadingTool;
