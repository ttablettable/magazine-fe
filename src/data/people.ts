// src/data/people.ts

export type PersonLinkType = "farcaster" | "bluesky" | "url";

export type Person = {
  slug: string;
  displayName: string;
  roles: string[];
  bio?: string;
  avatar?: {
    src: string;
    alt?: string;
    ratio?: number;
  };
  links?: Partial<Record<PersonLinkType, string>>;
};

export const PEOPLE: Record<string, Person> = {
  "anne-berlin": {
    slug: "anne-berlin",
    displayName: "Anne Berlin",
    roles: ["Contributor"],
  },

  "brandon-reis": {
    slug: "brandon-reis",
    displayName: "Brandon Reis",
    roles: ["Contributor"],
  },

  "brian-felix": {
    slug: "brian-felix",
    displayName: "Brian Felix",
    roles: ["Editor in Chief", "Contributor"],

    bio: `
Brian Felix is a multidisciplinary artist and writer working across film, photography,
and software. His practice explores systems, labor, and authorship in networked culture.
    `.trim(),

    avatar: {
      src: "/people/brian-felix.jpg",
      alt: "Portrait of Brian Felix",
    },

    links: {
      farcaster: "https://farcaster.xyz/chamaquito.eth",
      bluesky: "https://bsky.app/profile/chamaquito.bsky.social",
      url: "https://brianfelix.info",
    },
  },

  "doron-heifetz": {
    slug: "doron-heifetz",
    displayName: "Doron Heifetz",
    roles: ["Contributor"],
  },

  "emanuele-calianno": {
    slug: "emanuele-calianno",
    displayName: "Emanuele Calianno",
    roles: ["Contributor"],
  },

  "joseph-cirilo": {
    slug: "joseph-cirilo",
    displayName: "Joseph Cirilo",
    roles: ["Contributor"],
  },

  karl: {
    slug: "karl",
    displayName: "Karl",
    roles: ["Contributor"],
  },

  "paul-jun": {
    slug: "paul-jun",
    displayName: "Paul Jun",
    roles: ["Contributor"],
  },

  "rachel-fagiano": {
    slug: "rachel-fagiano",
    displayName: "Rachel Fagiano",
    roles: ["Contributor"],
  },
};
