"use client";

import React from "react";
import { useParams } from "next/navigation";
import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/layout/Footer";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "../../../components/ui/HoverCard";
import AspectRatioImage from "../../../components/ui/AspectRatioImage";
import styles from "../../page.module.css";
import Link from "next/link";

import Timeline from "../../../components/ui/Timeline";
import TimelineIcons from '../../../components/ui/TimelineIcons';
import type { TimelineItem } from "@/components/ui/Timeline";


const AuthorPage: React.FC = () => {
  const { slug } = useParams();

  // Define the buttons dynamically for cleaner code
  const buttons = [
    {
      id: "farcaster",
      src: "/fc-transparent-black.svg",
      alt: "Farcaster profile",
    },
    {
      id: "bluesky",
      src: "/bluesky.svg",
      alt: "Bluesky profile",
    },
    {
      id: "url",
      src: "/link.svg",
      alt: "Portfolio",
    },
  ];

  const timelineItems: TimelineItem[] = [
    {
      key: "1",
      content: (
        <>
          Draft initial concept for feature article{" "}
          <span className={styles.dates}>2023-07-12</span>
        </>
      ),
      color: "pink", // Planning stage
    },
    {
      key: "2",
      content: (
        <>
          Collaborate with co-author on outline for{" "}
          <Link href="https://example.com">
            <strong>"The Poetics of Light and Shadow"</strong>
          </Link>{" "}
          <span className={styles.dates}>2023-08-03</span>
        </>
      ),
      color: "pink",
      icon: 'handshake',
    },
    {
      key: "3",
      content: (
        <>
          Submit annotations for{" "}
          <strong>"Echoes of Tomorrow: The Future of Generative Art"</strong>{" "}
          <span className={styles.dates}>2023-08-15</span>
        </>
      ),
      color: "yellow",
      icon: 'handshake',
    },
    {
      key: "4",
      content: (
        <>
          Incorporate peer feedback on draft for{" "}
          <strong>"The Symphony of Decay"</strong>{" "}
          <span className={styles.dates}>2023-08-25</span>
        </>
      ),
      color: "yellow", // Action step
    },
    {
      key: "5",
      content: (
        <>
          Published feature article in{" "}
          <span className={styles.issue}>
            <Link href="">#pleasure</Link>
          </span>: <strong>"Reveries in Digital Motion"</strong>{" "}
          <span className={styles.dates}>2023-09-10</span>
        </>
      ),
      color: "green", 
      icon: 'medal'
    },
    {
      key: "6",
      content: (
        <>
          Added historical context to{" "}
          <strong>"A Chromatic Revival: Synthwave’s Enduring Legacy"</strong>{" "}
          <span className={styles.dates}>2023-10-05</span>
        </>
      ),
      color: "yellow", // Action step
    },
    {
      key: "7",
      content: (
        <>
          Profiled as a subject in{" "}
          <strong>"The Luminaries of Greenpoint"</strong>{" "}
          <span className={styles.dates}>2023-10-18</span>
        </>
      ),
      color: "purple", // Recognition or subject feature
    },
    {
      key: "8",
      content: (
        <>
          Contributed visual assets to{" "}
          <strong>
            "Through the Looking Glass: Augmented Reality and Its Discontents"
          </strong>{" "}
          <span className={styles.dates}>2023-11-01</span>
        </>
      ),
      color: "purple", // Recognition or subject feature
    },
    {
      key: "9",
      content: (
        <>
          Implemented version updates for annotated essay{" "}
          <strong>"Vanishing Boundaries in Art and Technology"</strong>{" "}
          <span className={styles.dates}>2023-11-10</span>
        </>
      ),
      color: "yellow", // Action step
    },
    {
      key: "10",
      content: (
        <>
          Moderated comments on{" "}
          <strong>"The Aesthetic Ethics of Generative Media"</strong>{" "}
          <span className={styles.dates}>2023-11-15</span>
        </>
      ),
      color: "yellow", // Action step
    },
    {
      key: "11",
      content: (
        <>
          Accepted as guest editor for upcoming issue of{" "}
          <strong>"The Temporal Archive"</strong>{" "}
          <span className={styles.dates}>2023-12-01</span>
        </>
      ),
      color: "green", // Completion or milestone
    },
  ];

  return (
    <div className={styles.page}>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h1>{slug}</h1>
          </div>
          <div>
            <p>Editor in chief</p>
          </div>
          <div className={styles.peepsImg}>
            <AspectRatioImage
              src="https://via.placeholder.com/450x300"
              alt="Example Image"
              ratio={1 / 1} // Aspect ratio
            />
          </div>
          <div className={styles.people}>
            <h4>Bio</h4>
            <p>
              merritt k is a writer and podcaster. Her first book, Videogames
              for Humans, is an exploration of contemporary interactive fiction
              and was nominated for a Lambda Literary Award for Best LGBT
              Anthology. Her second, a collection of poetry with Niina Pollari,
              will be published in 2017 by TigerBee Press. She hosts the
              podcasts Woodland Secrets and dadfeelings, and can be found on
              Twitter at @merrittk.
            </p>
          </div>
          <div className={styles.share}>
            <h4>Elsewhere</h4>
            {buttons.map((button) => (
              <HoverCard key={button.id}>
                <HoverCardTrigger asChild>
                  <button id={button.id} className={styles.button}>
                    <img
                      alt={button.alt}
                      draggable="false"
                      loading="lazy"
                      width="15"
                      height="15"
                      decoding="async"
                      src={button.src}
                    />
                  </button>
                </HoverCardTrigger>
                <HoverCardContent>
                  <p>{button.alt}</p>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
          <hr></hr>
        </div>
        <div>
          <Timeline items={timelineItems} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AuthorPage;
