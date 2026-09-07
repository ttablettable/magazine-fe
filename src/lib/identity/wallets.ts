export const EVM_CHAIN_NAMESPACE = "eip155";

export type VerifiedWallet = {
  chainNamespace: typeof EVM_CHAIN_NAMESPACE;
  address: string;
  normalizedAddress: string;
};

export function normalizeEvmAddress(address: string): string {
  const trimmed = address.trim();
  if (!/^0x[0-9a-fA-F]{40}$/.test(trimmed)) {
    throw new Error("Invalid EVM wallet address");
  }
  return trimmed.toLowerCase();
}

export function toVerifiedEvmWallets(
  accounts: readonly { type: string; chain_type?: string; address?: string }[],
): VerifiedWallet[] {
  const wallets = new Map<string, VerifiedWallet>();

  for (const account of accounts) {
    if (
      account.type !== "wallet" ||
      account.chain_type !== "ethereum" ||
      typeof account.address !== "string"
    ) {
      continue;
    }

    const normalizedAddress = normalizeEvmAddress(account.address);
    wallets.set(normalizedAddress, {
      chainNamespace: EVM_CHAIN_NAMESPACE,
      address: account.address,
      normalizedAddress,
    });
  }

  return [...wallets.values()];
}
