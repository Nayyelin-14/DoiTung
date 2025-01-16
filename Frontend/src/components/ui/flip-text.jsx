"use client";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";

export default function FlipText({
  word,
  duration = 0.5,
  delayMultiple = 0.08,

  framerProps = {
    hidden: { rotateX: -90, opacity: 0 },
    visible: { rotateX: 0, opacity: 1 },
  },

  className,
}) {
  return (
    <div className="flex justify-center space-x-2">
      <AnimatePresence mode="wait">
        {word.split("").map((char, i) => (
          <motion.span
            key={i}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={framerProps}
            transition={{ duration, delay: i * delayMultiple }}
            className={cn("origin-center drop-shadow-sm", className)}
          >
            {char}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
