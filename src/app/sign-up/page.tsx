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
            <input
              id="name"
              type="text"
              placeholder="enter name"
              required
            />

            <input
              id="email"
              type="email"
              placeholder="enter email address"
              required
            />

            <button type="submit">Create account</button>
          </form>

          <p className={styles.cite}>or</p>

          <div className={styles.oauth}>
            <button>Start with Google</button>
            <button>Start with Apple</button>
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