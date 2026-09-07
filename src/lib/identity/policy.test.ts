import assert from "node:assert/strict";
import test from "node:test";
import { actorHasCapability, capabilitiesForRoles } from "@/lib/identity/policy";

test("ordinary authenticated actors have no privileged capabilities", () => {
  const capabilities = capabilitiesForRoles([]);
  assert.equal(actorHasCapability({ capabilities }, "desk.access"), false);
  assert.equal(actorHasCapability({ capabilities }, "roles.manage"), false);
});

test("editorial actors cannot manage roles", () => {
  const capabilities = capabilitiesForRoles(["editorial"]);
  assert.equal(actorHasCapability({ capabilities }, "desk.access"), true);
  assert.equal(actorHasCapability({ capabilities }, "content.publish"), true);
  assert.equal(actorHasCapability({ capabilities }, "roles.manage"), false);
});

test("admin actors receive editorial and role-management capabilities", () => {
  const capabilities = capabilitiesForRoles(["admin"]);
  assert.equal(actorHasCapability({ capabilities }, "desk.access"), true);
  assert.equal(actorHasCapability({ capabilities }, "roles.manage"), true);
});
