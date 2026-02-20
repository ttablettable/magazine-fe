"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "../page.module.css";
import { PEOPLE } from "@/data/people";
import { Facehash } from "facehash";

const AboutPage: React.FC = () => {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div>
          <section id="hero">
            <h1>About Us</h1>
            <p>┳━┳</p>
            <h2>
              A digitally-native publication that features artists from
              different mediums.
            </h2>
            <p>
              Table serves is an online journal dedicated to underrated artists,
              that combines dynamic content with compelling critical debate. We
              see the genres of the interviews and the critical essay as vital
              but still underutilized ways of exploring the ideas and problems
              that animate the field of contemporary art, and we hope to push
              these genres beyond their most familiar forms, whether
              journalistic or academic. Our aim is to explore the broader
              implications of a given object of discourse (whether text, film,
              exhibition, building, project, or hypermedia), to expand the
              terrain of what we imagine discourse in the arts to be, and to
              broaden the diversity of voices that our field typically hears
              from. We are interested in reviews that test and expand the
              reviewer’s own intellectual commitments—theoretical, artistically,
              and political—through the work of others.
            </p>
            <p>
              On the surface, Table is a collection of textual and visual art
              created by unpublished artists, but if you look deeper, Table is a
              product of passion and dedication to something we love. Table
              Quarterly is a group of writers and art geeks who think that
              writing, along with many art forms, just begs to Table Quarterly
              is about introducing the creative minds that are shaping the world
              of the art, a top selection of passionate individuals, vibrant
              visual narrative and cutting-edge art. Table Quarterly is designed
              for and with the people who believe in a creative identity, take
              risks, and enjoy the process: unconventional and hungry.
            </p>
            <p>The editors can be reached at hello@ttable.co</p>
          </section>
          <section id="collaboration">
            <hr></hr>
            <h3>Collaboration</h3>
            <p>
              ‍We are always open to hear pitches, so feel free to send them our
              way. Essays, criticism, poetry, reportage, interviews, and short
              humor pieces will all be evaluated and considered.
            </p>
            <p>
              Table Quarterly is written by the community it serves: writers,
              photographers, illustrators, designers and painters. Do you have
              art work you&apos;d like to see featured in Table Quarterly? We
              regularly feature our readers&apos; works of art and rely on your
              willingness to share your ideas. Please keep in mind that we are
              absolutely not looking for formulaic "reviews" of any kind.
              We&apos;re far more interested in content that has you
              interacting, engaging, or wrestling with an artwork and artists in
              some personal or unique way. Creativity and thinking outside of
              the box are highly encouraged.
            </p>
            <p>
              Before you send us your submissions, please read over the
              submissions guidelines. Thank you.
            </p>
          </section>
          <section id="contributors">
            <hr></hr>
            <h3>Contributors</h3>
            <p>
              Table has one founder. Brian is managing the editorial calendar as
              well as building the platform. You can get a hold of him most
              Friday mornings on Discord.
            </p>
            <h4>Author Index</h4>

            <div className={styles.authorGrid}>
              {Object.values(PEOPLE).map((person) => (
                <Link
                  key={person.slug}
                  href={`/people/${person.slug}`}
                  className={styles.authorCard}
                >
                  <div className={styles.authorAvatar}>
                    {person.avatar ? (
                      <img src={person.avatar.src} alt={person.displayName} />
                    ) : (
                      <Facehash
                        name={person.slug}
                        intensity3d="dramatic"
                        colors={["#cdda53", "#f8ef69", "#72589f", "#be629f"]}
                        size={40}
                        enableBlink
                      />
                    )}
                  </div>

                  <div className={styles.authorMeta}>
                    <h5>{person.displayName}</h5>
                    <p>{person.roles.join(" · ")}</p>
                  </div>
                </Link>
              ))}
            </div>

            <p></p>
          </section>
          <section id="business-model">
            <hr></hr>
            <h3>Business Model</h3>
            <p>
              I&apos;ve spent a lot of time thinking about how the business
              model for Table alignes with the people who not only read Table,
              but it&apos;s mission as well. One thing is evident: We don&apos;t
              have advertising. There are no paywalls. This will never change.
              With that being said, this labor of love costs money to operate. I
              chose to focus on utility, accessibilty over walled gardens. I
              currently only ask for readers to collect our articles to help me
              maintain and frow the platform. In exchange for your support,
              I&apos;m offering my undying gratitude. As you collect the
              articles, I can use the owners as a list of folks to send future
              cool new shit to. For now, this model means that I am motivated to
              make the entire platform the first app you open when you wake up.
              In short, my purpose with Table is to make a platform that
              springboards artists and sparks conversation around art curation.
            </p>
            <p></p>
          </section>
          <section id="support-section">
            <hr></hr>
            <h3>Support</h3>
            <p>Find questions and answers in our Wiki.</p>
            <div>
              <a href="https://">Community Guidelines</a>
              <br></br>
              <a href="https://">Terms of Use</a>
              <br></br>
              <a href="https://">Privacy Policy</a>
              <br></br>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
