import type { Metadata } from "next";
import "./globals.css";
import Providers from "../components/Providers";
import Script from "next/script";
import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/layout/Footer";

import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: 'TABLE',
  description: 'a digitally native magazine about art',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={styles.sitePage}>
        <Providers>
          <Navigation />
          <main className={styles.siteMain}>
            {children}
            <Footer />
          </main>
        </Providers>
        <Script
          src="https://static.getclicky.com/js"
          strategy="afterInteractive"
          data-id={process.env.NEXT_PUBLIC_CLICKY_ID}
        />
      </body>
    </html>
  );
}
