import assert from "node:assert/strict";
import test from "node:test";
import {
  AuthorizationError,
  hasCapability,
  requireCapability,
} from "@/lib/auth/authorization";
import type { ActorContext } from "@/lib/identity/types";

test("server authorization helpers enforce the resolved capability set", () => {
  const ordinary = { capabilities: [] } satisfies Pick<ActorContext, "capabilities">;
  const admin = {
    capabilities: ["roles.manage"],
  } satisfies Pick<ActorContext, "capabilities">;

  assert.equal(hasCapability(ordinary, "desk.access"), false);
  assert.equal(hasCapability(admin, "roles.manage"), true);
  assert.throws(
    () => requireCapability(ordinary, "desk.access"),
    AuthorizationError,
  );
  assert.doesNotThrow(() => requireCapability(admin, "roles.manage"));
});
