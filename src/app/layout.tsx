import type { Metadata } from "next";
import "./globals.css";
import Providers from "../components/Providers";
import Script from "next/script";
import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/layout/Footer";

import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: "TABLE",
  description: "a digitally-native magazine about art",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          id="clicky-script"
          strategy="afterInteractive"
          src="https://static.getclicky.com/js"
          dangerouslySetInnerHTML={{
            __html: `
              var clicky_site_ids = clicky_site_ids || [];
              clicky_site_ids.push(101500850);
              (function() {
                var s = document.createElement('script');
                s.type = 'text/javascript';
                s.async = true;
                s.src = '//static.getclicky.com/js';
                ( document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0] ).appendChild( s );
              })();
            `,
          }}
        />
        <noscript>
          <p>
            <img
              alt="Clicky"
              width="1"
              height="1"
              src="//in.getclicky.com/101500850ns.gif"
            />
          </p>
        </noscript>
      </head>
      <body className={styles.sitePage}>
        <Providers>
          <Navigation />
          <main className={styles.siteMain}>
            {children}
            <Footer />
          </main>
        </Providers>
      </body>
    </html>
  );
}
