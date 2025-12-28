"use client";

import ActivityFeed from "@/components/activity/ActivityFeed";
import { buildActivity } from "@/lib/activityBuilder";
import type { GitHubPost } from "@/utils/githubFetch";
import { PEOPLE } from "@/data/people";
import type { PersonLinkType } from "@/data/people";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/HoverCard";
import AspectRatioImage from "@/components/ui/AspectRatioImage";
import Link from "next/link";
import styles from "./AuthorPage.module.css";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Activity } from "@/components/activity/activity.types";

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

  const activity = buildActivity({
    authorSlug,
    posts: allPosts,
  });

  const { slug } = useParams();
  const person = PEOPLE[slug as string];

  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (!person) {
      console.warn("[AuthorPage] No person found for slug:", slug);
      return;
    }

    async function loadAuthoredActivities() {
      const authored = allPosts.filter((post) =>
        post.authors.includes(person.slug)
      );

      const authoredActivities: Activity[] = authored.map((post) => ({
        id: `authored-${post.slug}`,
        type: "authored",
        title: post.headline,
        storySlug: post.slug,
        issue: post.issue,
        date: post.published ?? post.lastModified,
      }));

      setActivities(authoredActivities);
    }

    loadAuthoredActivities();
  }, [person, slug, allPosts]);

  if (!person) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <h1>{slug}</h1>
          <p>Profile not claimed yet.</p>
        </main>
      </div>
    );
  }

  const linkIcons: Record<PersonLinkType, string> = {
    farcaster: "/fc-transparent-black.svg",
    bluesky: "/bluesky.svg",
    url: "/link.svg",
  };

  return (
    <>
      <div className={styles.main}>
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <div>
              <div className={styles.peepsImg}>
                {person.avatar && (
                  <AspectRatioImage
                    src={person.avatar.src}
                    alt={person.avatar.alt ?? person.displayName}
                    ratio={person.avatar.ratio ?? 1 / 1}
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
                    <Link href={href} target="_blank" className={styles.button}>
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
    </>
  );
}
