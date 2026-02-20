"use client";

import ActivityFeed from "@/components/activity/ActivityFeed";
import { buildActivity } from "@/lib/activityBuilder";
import type { GitHubPost } from "@/lib/githubFetch";
import { PEOPLE } from "@/data/people";
import type { PersonLinkType } from "@/data/people";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/HoverCard";
import Link from "next/link";
import styles from "./AuthorPage.module.css";
import { Facehash } from "facehash";

type AuthorPageProps = {
  authorSlug: string;
  livePosts: GitHubPost[];
  archivePosts: GitHubPost[];
};

export default function AuthorPage({
  authorSlug,
  livePosts,
  archivePosts,
}: AuthorPageProps) {
  const allPosts = [...(livePosts ?? []), ...(archivePosts ?? [])];

  const person = PEOPLE[authorSlug];

  if (!person) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <h1>{authorSlug}</h1>
          <p>Profile not claimed yet.</p>
        </main>
      </div>
    );
  }

  /**
   * Normalize dates so Activity always receives Date | null
   */
  const normalizedPosts = allPosts.map((post) => ({
    ...post,
    normalizedDate: post.published
      ? new Date(post.published)
      : post.lastModified
      ? new Date(post.lastModified)
      : null,
  }));

  const activity = buildActivity({
    authorSlug,
    posts: normalizedPosts.map((post) => ({
      ...post,
      date: post.normalizedDate,
    })),
  });

  const linkIcons: Record<PersonLinkType, string> = {
    farcaster: "/fc-transparent-black.svg",
    bluesky: "/bluesky.svg",
    url: "/link.svg",
  };

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <div>
            <div className={styles.peepsImg}>
              {person.avatar && (
                <Facehash
                  name={person.displayName}
                  intensity3d="dramatic"
                  colors={["#cdda53", "#f8ef69", "#72589f", "#be629f"]}
                  size={90}
                  enableBlink
                />
              )}
            </div>
            <p className={styles.roles}>{person.roles.join(" · ")}</p>
          </div>

          <div>
            <h1>{person.displayName}</h1>
            <div className={styles.people}>
              {person.bio && (
                <>
                  <h4>Bio</h4>
                  <p>{person.bio}</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className={styles.share}>
          <h4>Elsewhere</h4>
          {person.links &&
            Object.entries(person.links).map(([key, href]) => (
              <HoverCard key={key}>
                <HoverCardTrigger asChild>
                  <Link
                    href={href}
                    target="_blank"
                    className={styles.button}
                  >
                    <img
                      src={linkIcons[key as PersonLinkType]}
                      alt={key}
                      width={15}
                      height={15}
                    />
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent>
                  <p>{key}</p>
                </HoverCardContent>
              </HoverCard>
            ))}
        </div>

        <hr />
      </div>

      <ActivityFeed items={activity} />
    </div>
  );
}