import React, { useState } from "react";
import Link from "next/link";
import styles from "./OnchainBox.module.css";

const OnchainBox: React.FC = () => {
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const [isMetaVisible, setIsMetaVisible] = useState(false);

  const toggleMetaVisibility = () => setIsMetaVisible(!isMetaVisible);

  const txHash =
  "0x6f291d4eefc546d0bf6af290c9dc89564535a533d588a2c47d37cdef15343cef";

  function shortenHash(txHash: string) {
    return txHash.slice(0, 13) + "...";
  }

  return (
    <>
      <div
        className={styles.memo}
        style={{ opacity: isMetaVisible ? 1 : 0 }}
      >
        <p>
          <b>Token ID:</b> 
          <div>31</div>
        </p>
        <p>
          <b>Block:</b>{" "}
          <Link href="https://basescan.org/tx/0x6f291d4eefc546d0bf6af290c9dc89564535a533d588a2c47d37cdef15343cef">
            31702583
          </Link>
        </p>
        <div>
          <b>Tx:</b>
          <Link href={`https://basescan.org/tx/${txHash}`}>
            <button className={styles.txButton}>
              {shortenHash(txHash)}
            </button>
          </Link>
        </div>
        <button id="mintButton" className={styles.mintButton}>
          <svg width="15" height="15" viewBox="0 0 1001 1001">
            <path
              d="M500.137 0.523193C224.003 0.523193 0.136597 224.39 0.136597 500.523C0.136597 776.656 224.003 1000.52 500.137 1000.52C776.27 1000.52 1000.14 776.656 1000.14 500.523C1000.14 224.39 776.27 0.523193 500.137 0.523193ZM500.137 909.756C274.137 909.756 90.9033 726.523 90.9033 500.523C90.9033 274.523 274.137 91.2899 500.137 91.2899C726.137 91.2899 909.37 274.523 909.37 500.523C909.37 726.523 726.137 909.756 500.137 909.756Z"
              fill="black"
            />
            <path
              d="M546.27 454.39V180.557H454.003V454.39H180.17V546.657H454.003V820.49H546.27V546.657H820.103V454.39H546.27Z"
              fill="black"
            />
          </svg>
        </button>
      </div>
      <div className={styles.box}>
        <button id="blockInfo" onClick={toggleMetaVisibility}>
          <img src="/blockchain.svg" width="25" height="25" alt="blockchain" />
        </button>
      </div>
    </>
  );
};

export default OnchainBox;
