export const ACTOR_ROLES = ["editorial", "admin"] as const;
export type ActorRole = (typeof ACTOR_ROLES)[number];

export const ACTOR_CAPABILITIES = [
  "desk.access",
  "content.review",
  "content.publish",
  "moderation.manage",
  "roles.manage",
] as const;

export type ActorCapability = (typeof ACTOR_CAPABILITIES)[number];

export type ActorContext = {
  actorId: string;
  profile: {
    handle: string | null;
    displayName: string | null;
  };
  roles: ActorRole[];
  capabilities: ActorCapability[];
};

export type VerifiedPrivyIdentity = {
  provider: "privy";
  providerUserId: string;
};
