'use client';

import { usePrivy } from '@privy-io/react-auth';
import styles from './Login.module.css';
import { useState } from 'react';

export default function Login() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!ready) return null;

  return (
    <div className={styles.container}>
      {authenticated ? (
        <div>
          <div
            className={styles.avatar}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            Profile
          </div>
          {showDropdown && (
            <div className={styles.dropdown}>
              <button disabled title="Coming soon">
                Dashboard
              </button>
              <button disabled title="Coming soon">
                Settings
              </button>
              <button onClick={logout}>Log out</button>
            </div>
          )}
        </div>
      ) : (
        <button
          disabled={!ready}
          onClick={login}
          className={styles.button}
        >
          Log in
        </button>
      )}
    </div>
  );
}
