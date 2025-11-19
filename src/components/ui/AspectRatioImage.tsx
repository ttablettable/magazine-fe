"use client";

import React, { useState } from "react";
import styles from "./AspectRatioImage.module.css";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";

interface AspectRatioImageProps {
  src: string;
  alt: string;
  ratio: number; // Aspect ratio (e.g., 16 / 9, 4 / 3, etc.)
  className?: string; // Optional className for additional styling
}

const AspectRatioImage: React.FC<AspectRatioImageProps> = ({
  src,
  alt,
  ratio,
  className,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <AspectRatio ratio={ratio}>
      <div className={`${styles.container} ${className || ""}`}>
        {/* Placeholder displayed until the image loads */}
        {!isLoaded && (
          <div
            className={styles.placeholder}
            style={{
              backgroundImage:
                "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAlIDEwMCUiIHByZXNlcnZlQXNwZWN0UmF0aT0ibm9uZSI+CiAgICA8cmVjdCB4PSIwIiB5PSIwIiBzdHlsZT0iZmlsbDp3aGl0ZTtzdHJva2U6YmxhY2s7c3Ryb2tlLXdpZHRoOjM7IiBpZD0icmVjdGFuZ2xlMSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPgogICAgPGxpbmUgaWQ9ImxpbmUxIiB4MT0iMCIgeTE9IjAiIHgyPSIxMDAlIiB5Mj0iMTAwJSIgc3R5bGU9InN0cm9rZTpibGFjaztmaWxsOm5vbmU7c3Ryb2tlLXdpZHRoOjI7Ii8+CiAgICA8bGluZSBpZD0ibGluZTIiIHgxPSIxMDAlIiB5MT0iMCIgeDI9IjAiIHkyPSIxMDAlIiBzdHlsZT0ic3Ryb2tlOmJsYWNrO2ZpbGw6bm9uZTtzdHJva2Utd2lkdGg6MjsiLz4KPC9zdmc+)",
            }}
          ></div>
        )}

        {/* Image element */}
        <img
          src={src}
          alt={alt}
          className={`${styles.image} ${isLoaded ? styles.loaded : ""}`}
          onLoad={() => setIsLoaded(true)}
        />
      </div>
    </AspectRatio>
  );
};

export default AspectRatioImage;
