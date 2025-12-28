"use client";

import React from "react";
import { computeDiff, DiffLine } from "@/lib/diffUtils";

import styles from "./page.module.css";

interface InlineDiffProps {
  oldText: string;
  newText: string;
}

export function InlineDiff({ oldText, newText }: InlineDiffProps) {
  const lines = computeDiff(oldText, newText);

  return (
    <pre className={styles.inlineDiffBlock}>
      {lines.map((line, i) => {
        const className =
          line.type === "add"
            ? styles.diffAdd
            : line.type === "remove"
            ? styles.diffRemove
            : styles.diffContext;

        const prefix =
          line.type === "add" ? "+" : line.type === "remove" ? "-" : " ";

        return (
          <div key={i} className={className}>
            {prefix} {line.value}
          </div>
        );
      })}
    </pre>
  );
}
