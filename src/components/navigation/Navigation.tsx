"use client"
import React from "react";
import Link from "next/link";
import styles from "./Navigation.module.css";

import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "../ui/ContextMenu";

import Login from "../Login";

const Navigation: React.FC = () => {
  return (
    <header className={styles.header}>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className={styles.navButton}>
            <Link href="/">
              <div className={styles.navLinks}>
                <img
                  alt="Table Logo"
                  draggable="false"
                  loading="lazy"
                  width="20"
                  height="20"
                  src="/logo.svg"
                />
              </div>
            </Link>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => alert("Go to Home")}>
            Copy logo
          </ContextMenuItem>
          <ContextMenuItem onClick={() => alert("Open Settings")}>
            Copy wordmark
          </ContextMenuItem>
          <ContextMenuItem onClick={() => alert("Log Out")}>
            Download partnership deck
            </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <div className={styles.navbar}>
      <div className={styles.navButton}>
        <Link href="/">
          <div className={styles.navLinks}>Most Read</div>
        </Link>
      </div>
      <div className={styles.navButton}>
        <Link href="/">
          <div className={styles.navLinks}>Our Picks</div>
        </Link>
      </div>
      </div>

      <Login />
      {/* <div className={styles.navButton}>
        <p>
          <Link className={styles.navLinks} draggable="false" href="https://">
            Museum 🔜
          </Link>
        </p>
      </div> */}
    </header>
  );
};

export default Navigation;
