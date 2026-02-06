import styles from "../page.module.css";

const SupportPage: React.FC = () => {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div>

          <section id="hero">
            <h1>Support</h1>
            <p>┳━┳</p>
            <h2>
              Table is free to read. No ads. No paywalls. No algorithm deciding what matters.
            </h2>
            <p>
              Table Quarterly is sustained by time, curiosity, and a belief that thoughtful
              art discourse still deserves space online. Right now, it is not making money.
              It exists because it should.
            </p>
          </section>

          <section>
            <hr />
            <h3>Collecting Articles</h3>
            <p>
              Soon, you will be able to collect individual articles — minting a digital
              edition as a way of supporting the magazine.
            </p>
            <p>
              Collecting is not a subscription. It does not gate access. It is a signal:
              that a piece resonated, that it mattered, that you want it archived in your
              own library.
            </p>
            <p>
              In time, collected articles may unlock invitations, experimental features,
              or printed editions. For now, this functionality is coming soon.
            </p>
          </section>

          <section>
            <hr />
            <h3>Donations</h3>
            <p>
              Table will also accept voluntary support through traditional payments and
              crypto. No tiers. No gated content. Just optional participation.
            </p>
            <p>
              At the moment, donations are not yet enabled.
            </p>
          </section>

          <section>
            <hr />
            <h3>Current State</h3>
            <p>
              Table generates no revenue today. There are no sponsors, no ads, and no
              subscriptions.
            </p>
            <p>
              If you are reading, sharing, or sending thoughtful messages — you are
              already supporting the work.
            </p>
          </section>

          <section id="support-section">
            <hr />
            <h3>More</h3>
            <div>
              <a href="https://">Community Guidelines</a><br />
              <a href="https://">Terms of Use</a><br />
              <a href="https://">Privacy Policy</a><br />
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default SupportPage;
