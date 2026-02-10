"use client";

import { Facehash } from "facehash";

export default function HotEmpty() {
  return (
    <>
      <p style={{ opacity: 0.6, marginTop: "2rem", marginBottom: "2rem" }}>
        The week is still unfolding.
      </p>
      <Facehash
        name="most-read"
        intensity3d="dramatic"
        size={150}
        enableBlink
      />
    </>
  );
}
