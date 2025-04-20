import { motion, MotionConfig } from "framer-motion";
import { useState } from "react";

const VARIANTS = {
  top: {
    open: {
      rotate: ["0deg", "0deg", "45deg"],
      y: ["0%", "0%", "8px"],
    },
    closed: {
      rotate: ["45deg", "0deg", "0deg"],
      y: ["8px", "0%", "0%"],
    },
  },
  middle: {
    open: { opacity: 0 },
    closed: { opacity: 1 },
  },
  bottom: {
    open: {
      rotate: ["0deg", "0deg", "-45deg"],
      y: ["0%", "0%", "-8px"],
    },
    closed: {
      rotate: ["-45deg", "0deg", "0deg"],
      y: ["-8px", "0%", "0%"],
    },
  },
};

const AnimatedHamburgerButton = () => {
  const [active, setActive] = useState(false);

  return (
    <MotionConfig
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
    >
      <motion.button
        initial={false}
        animate={active ? "open" : "closed"}
        onClick={() => setActive((pv) => !pv)}
        className="relative h-[64px] w-8 rounded-full bg-gray-400/0 transition-colors hover:bg-white/20"
      >
        <motion.span
          variants={VARIANTS.top}
          className="absolute h-1 w-6 bg-gray-400"
          style={{
            top: "35%",
            left: "50%",
            translateX: "-50%",
          }}
        />
        <motion.span
          variants={VARIANTS.middle}
          className="absolute h-1 w-6 bg-gray-400"
          style={{
            top: "50%",
            left: "50%",
            translateX: "-50%",
            translateY: "-50%",
          }}
        />
        <motion.span
          variants={VARIANTS.bottom}
          className="absolute h-1 w-6 bg-gray-400"
          style={{
            bottom: "35%",
            left: "50%",
            translateX: "-50%",
          }}
        />
      </motion.button>
    </MotionConfig>
  );
};

export default AnimatedHamburgerButton;
