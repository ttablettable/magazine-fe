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
              <button onClick={() => console.log('Dashboard clicked')}>
                Dashboard
              </button>
              <button onClick={() => console.log('Settings clicked')}>
                Settings
              </button>
              <button onClick={logout}>Log Out</button>
            </div>
          )}
        </div>
      ) : (
        <button
          disabled={!ready}
          onClick={login}
          className={styles.button}
        >
          Log In
        </button>
      )}
    </div>
  );
}
