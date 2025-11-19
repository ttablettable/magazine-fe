"use client";

import { useEffect } from "react";
import styles from "./NotifPop.module.css";

interface NotifPopProps {
  id: string;
  text: string;
  x?: number;
  y?: number;
  variant?: "neutral" | "success" | "error";
  duration?: number;
  onClose: (id: string) => void;
}

export default function NotifPop({
  id,
  text,
  x = 0,
  y = 0,
  variant = "neutral",
  duration = 1400,
  onClose,
}: NotifPopProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <div
      className={`${styles.popover} ${styles[variant]}`}
      style={{ top: y, left: x }}
    >
      {text}
    </div>
  );
}
