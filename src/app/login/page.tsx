import Link from "next/link";
import styles from "./page.module.css";

const LoginPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.main}>
        <section className={styles.card}>
          <header className={styles.header}>
            <div>
              <h1>Table</h1>
              <p>Login</p>
            </div>
            <img src="/logo.svg" alt="Table logo" className={styles.logo} />
          </header>

          <form className={styles.form}>
            <input
              id="email"
              type="email"
              placeholder="enter email address"
              required
            />

            <button type="submit">Send me a login link</button>
          </form>

          <p className={styles.cite}>or</p>

          <div className={styles.oauth}>
            <button>Login with Google</button>
            <button>Login with Apple</button>
          </div>
          <p className={styles.muted}>
            Don’t have an account? <br />
            <Link href="/sign-up">Sign up</Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
