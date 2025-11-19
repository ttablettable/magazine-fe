"use client";

import React, { useEffect, useState, useRef, RefObject } from "react";
import styles from "./HighlightMenu.module.css";

interface HighlightMenuProps {
  targetRef: RefObject<HTMLElement>;
  renderMenu: (props: {
    selectedText: string;
    closeMenu: () => void;
  }) => React.ReactNode;
}

const FADE_DURATION = 150; // match CSS transition

const HighlightMenu: React.FC<HighlightMenuProps> = ({
  targetRef,
  renderMenu,
}) => {
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedText, setSelectedText] = useState("");
  const [isClosing, setIsClosing] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Smooth fade → then unmount
  const triggerClose = () => {
    if (isClosing || !menuPosition) return;

    setIsClosing(true);

    setTimeout(() => {
      setMenuPosition(null);
      setSelectedText("");
      setIsClosing(false);
    }, FADE_DURATION);
  };

  const handleMouseUp = () => {
    if (!targetRef.current) return;

    const selection = window.getSelection();

    // Safety checks
    if (!selection || selection.rangeCount === 0) {
      triggerClose();
      return;
    }

    const text = selection.toString().trim();
    if (!text) {
      triggerClose();
      return;
    }

    const anchor = selection.anchorNode;
    if (!anchor || !targetRef.current.contains(anchor)) {
      triggerClose();
      return;
    }

    const rect = selection.getRangeAt(0).getBoundingClientRect();

    setMenuPosition({
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
    });

    setSelectedText(text);
    setIsClosing(false);
  };

  const handleScroll = () => {
    if (menuPosition) triggerClose();
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      triggerClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("scroll", handleScroll, true);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("scroll", handleScroll, true);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuPosition, targetRef]);

  if (!menuPosition) return null;

  return (
    <div
      ref={menuRef}
      className={`${styles.menuWrapper} ${isClosing ? styles.closing : ""}`}
      style={{
        top: menuPosition.y,
        left: menuPosition.x,
        position: "absolute",
      }}
    >
      <div className={styles.menu}>
        {renderMenu({ selectedText, closeMenu: triggerClose })}
      </div>
    </div>
  );
};

export default HighlightMenu;
