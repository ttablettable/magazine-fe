import React from "react";
import Link from "next/link";
import styles from "./Share.module.css";

const Share: React.FC<{ onCopy?: (url: string) => void }> = ({ onCopy }) => {
  const currentUrl =
    typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className={styles.box}>
       <button
        id="copyButton"
        onClick={() => {
          if (onCopy) onCopy(currentUrl);
        }}
      >
        <img src="/link.svg" width="20" height="20" alt="" />
      </button>
      <Link href={`https://wa.me/?text=Check this out!&url=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noopener noreferrer">
        <div className={styles.icon}>
          <img
            alt="Share on WhatsApp"
            draggable="false"
            loading="lazy"
            src="/whatsapp.svg"
          />
        </div>
      </Link>
      <Link href={`https://bsky.app/share?text=Check this out!&url=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noopener noreferrer">
        <div className={styles.icon}>
          <img
            alt="Share on Bluesky"
            draggable="false"
            loading="lazy"
            src="/bluesky-1.svg"
          />
        </div>
      </Link>
      <Link href={`farcaster://share?text=Check this out!&url=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noopener noreferrer">
        <div className={styles.icon}>
          <img
            alt="Share on Farcaster"
            draggable="false"
            loading="lazy"
            src="/fc-transparent-purple.svg"
          />
        </div>
      </Link>
      <Link href={`https://www.reddit.com/submit?url=${encodeURIComponent(currentUrl)}&title=Check this out!`} target="_blank" rel="noopener noreferrer">
        <div className={styles.icon}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <circle cx="8.5" cy="12.5" r="1.5"></circle>
            <circle cx="15.5" cy="12.5" r="1.5"></circle>
            <path d="M12,19.654c-1.705,0-3.409-0.649-4.707-1.947c-0.391-0.391-0.391-1.023,0-1.414s1.023-0.391,1.414,0 c1.815,1.815,4.771,1.815,6.586,0c0.391-0.391,1.023-0.391,1.414,0s0.391,1.023,0,1.414C15.409,19.005,13.705,19.654,12,19.654z"></path>
            <path
              d="M22,12c0-1.105-0.895-2-2-2c-0.456,0-0.872,0.159-1.209,0.416C17.141,8.938,14.714,8,12,8	s-5.141,0.938-6.791,2.416C4.872,10.159,4.456,10,4,10c-1.105,0-2,0.895-2,2c0,0.796,0.468,1.478,1.142,1.799	C3.055,14.19,3,14.59,3,15c0,3.866,4.029,7,9,7s9-3.134,9-7c0-0.41-0.055-0.81-0.142-1.201C21.532,13.478,22,12.796,22,12z"
              opacity=".35"
            ></path>
            <path d="M19,2c-0.677,0-1.273,0.338-1.635,0.853l-2.438-0.488c-1.476-0.294-2.957,0.561-3.434,1.993l-1.262,3.785	C10.804,8.054,11.393,8,12,8c0.129,0,0.254,0.012,0.382,0.016l1.009-3.025c0.159-0.479,0.652-0.764,1.145-0.665l2.666,0.533	C17.524,5.532,18.205,6,19,6c1.105,0,2-0.895,2-2C21,2.895,20.105,2,19,2z"></path>
          </svg>
        </div>
      </Link>
      <Link href={`mailto:?subject=Check this out!&body=I thought you might find this interesting: ${encodeURIComponent(currentUrl)}`} target="_blank" rel="noopener noreferrer">
        <div className={styles.icon}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <rect width="14" height="16" x="5" y="4" opacity=".35"></rect>
            <path d="M19,4l-7,4.99L5,4C3.343,4,2,5.343,2,7v10c0,1.657,1.343,3,3,3V7.707l7,4.959l7-4.959V20c1.657,0,3-1.343,3-3V7	C22,5.343,20.657,4,19,4z"></path>
          </svg>
        </div>
      </Link>
    </div>
  );
};

export default Share;
