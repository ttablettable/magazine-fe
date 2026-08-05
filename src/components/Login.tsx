'use client';

import { usePrivy } from '@privy-io/react-auth';
import styles from './Login.module.css';
import { useEffect, useRef, useState } from 'react';

export default function Login() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const [showDropdown, setShowDropdown] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstItemRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (showDropdown) {
      firstItemRef.current?.focus();
    }
  }, [showDropdown]);

  function closeDropdown() {
    setShowDropdown(false);
    triggerRef.current?.focus();
  }

  function handleDropdownKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeDropdown();
    }
  }

  if (!ready) return null;

  return (
    <div className={styles.container}>
      {authenticated ? (
        <div>
          <button
            type="button"
            ref={triggerRef}
            className={styles.avatar}
            onClick={() => setShowDropdown((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={showDropdown}
          >
            Profile
          </button>
          {showDropdown && (
            <div
              className={styles.dropdown}
              role="menu"
              onKeyDown={handleDropdownKeyDown}
            >
              <button role="menuitem" disabled title="Coming soon">
                Dashboard
              </button>
              <button role="menuitem" disabled title="Coming soon">
                Settings
              </button>
              <button
                ref={firstItemRef}
                role="menuitem"
                onClick={() => { logout(); closeDropdown(); }}
              >
                Log out
              </button>
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
