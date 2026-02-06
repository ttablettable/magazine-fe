"use client";
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
      <div className={styles.navbarAction}>
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div className={styles.navLogo}>
              <Link href="/">
                <img
                  alt="Table Logo"
                  draggable="false"
                  loading="lazy"
                  src="/logo.svg"
                />
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
          <div className={styles.navbarItem}>
            <Link href="/hot">
              Most Read
            </Link>
          </div>
          <div className={styles.navbarItem}>
            <Link href="/picks">
              Our Picks
            </Link>
          </div>
        </div>
      </div>

      {/* <Login />
       <div className={styles.navButton}>
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
