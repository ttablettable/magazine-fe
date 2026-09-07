import assert from "node:assert/strict";
import test from "node:test";
import { normalizeEvmAddress, toVerifiedEvmWallets } from "@/lib/identity/wallets";

const WALLET_A = "0xAa00000000000000000000000000000000000001";
const WALLET_B = "0xBb00000000000000000000000000000000000002";

test("EVM addresses normalize deterministically", () => {
  assert.equal(normalizeEvmAddress(WALLET_A), WALLET_A.toLowerCase());
});

test("multiple verified EVM wallets are retained and duplicates collapse", () => {
  const wallets = toVerifiedEvmWallets([
    { type: "wallet", chain_type: "ethereum", address: WALLET_A },
    { type: "wallet", chain_type: "ethereum", address: WALLET_B },
    { type: "wallet", chain_type: "ethereum", address: WALLET_A.toLowerCase() },
    { type: "email", address: "reader@example.invalid" },
  ]);

  assert.equal(wallets.length, 2);
  assert.deepEqual(
    wallets.map(({ normalizedAddress }) => normalizedAddress).sort(),
    [WALLET_A.toLowerCase(), WALLET_B.toLowerCase()],
  );
});

test("wallet extraction never manufactures public profile fields", () => {
  const profile = { handle: null, displayName: null };
  toVerifiedEvmWallets([
    { type: "wallet", chain_type: "ethereum", address: WALLET_A },
  ]);
  assert.deepEqual(profile, { handle: null, displayName: null });
});
