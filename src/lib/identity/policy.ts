import type {
  ActorCapability,
  ActorContext,
  ActorRole,
} from "@/lib/identity/types";

const ROLE_CAPABILITIES: Readonly<Record<ActorRole, readonly ActorCapability[]>> = {
  editorial: [
    "desk.access",
    "content.review",
    "content.publish",
    "moderation.manage",
  ],
  admin: [
    "desk.access",
    "content.review",
    "content.publish",
    "moderation.manage",
    "roles.manage",
  ],
};

export function capabilitiesForRoles(
  roles: readonly ActorRole[],
): ActorCapability[] {
  return [...new Set(roles.flatMap((role) => ROLE_CAPABILITIES[role]))];
}

export function actorHasCapability(
  actor: Pick<ActorContext, "capabilities">,
  capability: ActorCapability,
): boolean {
  return actor.capabilities.includes(capability);
}
