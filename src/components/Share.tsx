import React from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import styles from "./Share.module.css";

const Share: React.FC<{ url: string; onCopy?: (url: string) => void }> = ({
  url,
  onCopy,
}) => {
  const text = "Leaving this here.";
  const encodedUrl = encodeURIComponent(url);
  const encodedTextWithUrl = encodeURIComponent(`${text} ${url}`);

  return (
    <div className={styles.box}>
      {/* Copy */}
      <button
        onClick={() => {
          navigator.clipboard.writeText(url);
          onCopy?.(url);
        }}
      >
        <Icon name="link" size={20} />
      </button>

      {/* WhatsApp */}
      <a
        href={`https://wa.me/?text=${encodedTextWithUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.icon}
      >
        <img src="/whatsapp.svg" alt="Share on WhatsApp" />
      </a>

      {/* Bluesky (FIXED) */}
      <a
        href={`https://bsky.app/intent/compose?text=${encodedTextWithUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.icon}
      >
        <img src="/bluesky-1.svg" alt="Share on Bluesky" />
      </a>

      {/* Farcaster (robust) */}
      <a
        href={`https://warpcast.com/~/compose?text=${encodedTextWithUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.icon}
      >
        <img src="/fc-transparent-purple.svg" alt="Share on Farcaster" />
      </a>
      <Link
        href={`https://www.reddit.com/submit?url=${encodedUrl}&title=${encodeURIComponent(
          text,
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.icon}
      >
        <Icon name="reddit" size={24} />
      </Link>
      <Link
        href={`mailto:?subject=${encodeURIComponent(
          text,
        )}&body=${encodeURIComponent(`I thought you might like this:\n\n${url}`)}`}
        className={styles.icon}
      >
          <Icon name="mail" size={24} />
      </Link>
    </div>
  );
};

export default Share;
