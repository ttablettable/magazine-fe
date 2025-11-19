'use client';

import { PrivyProvider } from '@privy-io/react-auth';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId="cm3wfq954024pgvtjwp6vc2dc"
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          logo: '/logo.svg',
          landingHeader: 'Login to collect or contribute',
          loginMessage: 'TTABLE Quarterly',
          walletList: ['rainbow', 'wallet_connect'],
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
