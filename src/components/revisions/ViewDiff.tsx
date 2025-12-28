"use client";

import React from "react";
import { computeDiff, DiffLine } from "@/lib/diffUtils";

import styles from "./page.module.css";

interface ViewDiffProps {
  oldText: string;
  newText: string;
}

export function ViewDiff({ oldText, newText }: ViewDiffProps) {
  const lines = computeDiff(oldText, newText);

  return (
    <div className={styles.diffView}>
      <div className={styles.diffCol}>
        <h3>Previous</h3>
        <pre>
          {lines
            .filter((l) => l.type !== "add")
            .map((line, i) => {
              const className =
                line.type === "remove" ? styles.diffRemove : styles.diffContext;
              const prefix = line.type === "remove" ? "-" : " ";
              return (
                <div key={i} className={className}>
                  {prefix} {line.value}
                </div>
              );
            })}
        </pre>
      </div>

      <div className={styles.diffCol}>
        <h3>Current</h3>
        <pre>
          {lines
            .filter((l) => l.type !== "remove")
            .map((line, i) => {
              const className =
                line.type === "add" ? styles.diffAdd : styles.diffContext;
              const prefix = line.type === "add" ? "+" : " ";
              return (
                <div key={i} className={className}>
                  {prefix} {line.value}
                </div>
              );
            })}
        </pre>
      </div>
    </div>
  );
}
