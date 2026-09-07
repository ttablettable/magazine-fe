import "server-only";

import { actorHasCapability } from "@/lib/identity/policy";
import type {
  ActorCapability,
  ActorContext,
} from "@/lib/identity/types";

export class AuthorizationError extends Error {
  readonly status = 403;

  constructor(capability: ActorCapability) {
    super(`Missing required capability: ${capability}`);
    this.name = "AuthorizationError";
  }
}

export function hasCapability(
  actor: Pick<ActorContext, "capabilities">,
  capability: ActorCapability,
): boolean {
  return actorHasCapability(actor, capability);
}

export function requireCapability(
  actor: Pick<ActorContext, "capabilities">,
  capability: ActorCapability,
): void {
  if (!hasCapability(actor, capability)) {
    throw new AuthorizationError(capability);
  }
}
