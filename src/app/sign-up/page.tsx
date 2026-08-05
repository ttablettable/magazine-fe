import Link from "next/link";
import styles from "../login/page.module.css";

const SignUpPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.main}>
        <section className={styles.card}>
          <header className={styles.header}>
            <div>
              <h1>Table</h1>
              <p>Sign up</p>
            </div>
            <img src="/logo.svg" alt="Table logo" className={styles.logo} />
          </header>

          <form className={styles.form}>
            <label htmlFor="name" className={styles.label}>
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Jane Doe"
              autoComplete="name"
              required
            />

            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              required
            />

            <button type="submit">Create account</button>
          </form>

          <p className={styles.cite}>or</p>

          <div className={styles.oauth}>
            <button type="button">Continue with Google</button>
            <button type="button">Continue with Apple</button>
          </div>

          <p className={styles.muted}>
            Already have an account? <br />
            <Link href="/login">Log in</Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default SignUpPage;