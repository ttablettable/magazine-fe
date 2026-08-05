"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Facehash } from "facehash";

export default function HotEmpty() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
    >
      <p style={{ opacity: 0.6, marginTop: "2rem", marginBottom: "2rem" }}>
        The week is still unfolding.
      </p>
      <Facehash
        name="most-read"
        intensity3d="dramatic"
        size={150}
        enableBlink
      />
    </motion.div>
  );
}
