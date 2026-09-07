import assert from "node:assert/strict";
import test from "node:test";
import {
  authenticatePrivyRequest,
  AuthenticationError,
} from "@/lib/auth/privy";

test("missing Privy bearer credentials are rejected", async () => {
  await assert.rejects(
    authenticatePrivyRequest(new Request("https://ttable.test/api/me")),
    AuthenticationError,
  );
});

test("a malformed Privy access token is rejected before verification", async () => {
  await assert.rejects(
    authenticatePrivyRequest(
      new Request("https://ttable.test/api/me", {
        headers: { authorization: "Bearer invalid" },
      }),
    ),
    AuthenticationError,
  );
});

test("a cryptographically verified token supplies only the Privy identity", async () => {
  const identity = await authenticatePrivyRequest(
    new Request("https://ttable.test/api/me", {
      headers: { authorization: "Bearer header.payload.signature" },
    }),
    async () => ({ user_id: "did:privy:test-user" }),
  );

  assert.deepEqual(identity, {
    provider: "privy",
    providerUserId: "did:privy:test-user",
  });
});

test("verification failure is always unauthorized", async () => {
  await assert.rejects(
    authenticatePrivyRequest(
      new Request("https://ttable.test/api/me", {
        headers: { authorization: "Bearer header.payload.signature" },
      }),
      async () => {
        throw new Error("signature mismatch");
      },
    ),
    AuthenticationError,
  );
});
