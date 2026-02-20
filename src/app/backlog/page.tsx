import React from "react";
import Navigation from "../../components/navigation/Navigation";
import Footer from "../../components/layout/Footer";
import styles from "../page.module.css";

const BacklogPage: React.FC = () => {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section id="hero">
          <h1>Roadmap</h1>
          <p>
            On this page you&apos;ll be able to see what I&apos;ve shipped
            recently, what features are up next, and how we&apos;re doing as a
            group. I&apos;m sharring this information to demistify the weird and
            wonderful process of working on a bootstrapped publication. I&apos;m
            working hard to build a mindful space. I have a lot of ideas for how
            to do a better job, as well as lots of challenges. This is meant to
            be as transparent as reasonably possible. If there&apos;s
            information that you don&apos;t see here that you would like to
            know, just email me at brian@ttable.co. The first goal is to not
            only break-even but to pay the homies to write for the publication.
          </p>
          <h3>Road to self-sustainability</h3>
          <p>
            The plan is for Table to be self-sustainanle member-supported
            community. Since we are accountable to our members instead of
            advertisers, my incentive is always to build a platform that fosters
            learning and wholesome dialog. This means that Table&apos;s future
            relies entirely on community contributions.
          </p>
        </section>
        <section id="expenses">
          <h3>Expenses</h3>
          <h4>Story budget</h4>
          <ul>
            <li>Interviews</li>
            <li>Ideas</li>
            <li>Columns</li>
          </ul>
        </section>
        <section id="product-plan">
          <hr></hr>
          <h3>Product Plan</h3>
          <span className="latest-update">Last update: </span>{" "}
          <span className="latest-update">April 20, 2023</span>
          <h4>In progress & upcoming</h4>
          <ul>
            <li>Task</li>
            <li>Task</li>
          </ul>
          <h4>Completed</h4>
          <ul>
            <li>Task</li>
            <li>Task</li>
          </ul>
        </section>
        <section id="changelog">
          <hr></hr>
          <h3>Changelog</h3>
          <h4></h4>
          <span className="latest-update">Last update: </span>{" "}
          <span className="latest-update">April 20, 2023</span>
          <ul>
            <li>Public beta</li>
          </ul>
          <p>To go back further in time, visit our Wiki.</p>
        </section>
      </main>
    </div>
  );
};

export default BacklogPage;
