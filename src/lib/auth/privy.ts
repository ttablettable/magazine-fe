import "server-only";

import { PrivyClient } from "@privy-io/node";
import type { VerifiedPrivyIdentity } from "@/lib/identity/types";
import { toVerifiedEvmWallets } from "@/lib/identity/wallets";

const LEGACY_PUBLIC_PRIVY_APP_ID = "cm3wfq954024pgvtjwp6vc2dc";

type VerifyAccessToken = (token: string) => Promise<{ user_id: string }>;

let privyClient: PrivyClient | undefined;

export class AuthenticationError extends Error {
  readonly status = 401;

  constructor(message = "Authentication required") {
    super(message);
    this.name = "AuthenticationError";
  }
}

function getPrivyAppId(): string {
  return process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? LEGACY_PUBLIC_PRIVY_APP_ID;
}

function getPrivyClient(): PrivyClient {
  if (privyClient) {
    return privyClient;
  }

  const appSecret = process.env.PRIVY_APP_SECRET;
  if (!appSecret) {
    throw new Error("Missing PRIVY_APP_SECRET");
  }

  privyClient = new PrivyClient({
    appId: getPrivyAppId(),
    appSecret,
    jwtVerificationKey: process.env.PRIVY_VERIFICATION_KEY,
  });
  return privyClient;
}

export function extractPrivyAccessToken(request: Request): string {
  const authorization = request.headers.get("authorization");
  const match = authorization?.match(/^Bearer ([^\s]+)$/i);
  if (!match) {
    throw new AuthenticationError();
  }

  const token = match[1];
  if (token.split(".").length !== 3) {
    throw new AuthenticationError("Invalid or expired access token");
  }
  return token;
}

async function verifyWithPrivy(token: string) {
  return getPrivyClient().utils().auth().verifyAccessToken(token);
}

export async function authenticatePrivyRequest(
  request: Request,
  verifyAccessToken: VerifyAccessToken = verifyWithPrivy,
): Promise<VerifiedPrivyIdentity> {
  const token = extractPrivyAccessToken(request);

  try {
    const claims = await verifyAccessToken(token);
    if (!claims.user_id) {
      throw new AuthenticationError("Invalid or expired access token");
    }
    return { provider: "privy", providerUserId: claims.user_id };
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error;
    }
    throw new AuthenticationError("Invalid or expired access token");
  }
}

export async function fetchVerifiedPrivyWallets(providerUserId: string) {
  const user = await getPrivyClient().users()._get(providerUserId);
  return toVerifiedEvmWallets(user.linked_accounts);
}
