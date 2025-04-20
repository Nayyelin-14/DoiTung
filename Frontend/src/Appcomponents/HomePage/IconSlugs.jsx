import React, { lazy, Suspense, useEffect } from "react";
import { OrbitProgress } from "react-loading-indicators";
import { motion } from "framer-motion";

const IconCloud = lazy(() => import("@/components/ui/icon-cloud"));

const IconSlugs = ({ onLoaded }) => {
  const slugs = [
    "microsoftteams",
    "slack",
    "zoom",
    "asana",
    "trello",
    "notion",
    "github",
    "gitlab",
    "figma",
    "googlemeet",
    "microsoftoutlook",
    "linkedin",
    "medium",
    "edx",
    "coursera",
    "khanacademy",
    "udemy",
    "microsoftpowerpoint",
    "microsoftword",
    "microsoftexcel",
    "stackoverflow",
    "youtube",
    "firebase",
    "react",
    "javascript",
    "python",
  ];

  // Run after mount (optional delay for effect)
  useEffect(() => {
    const timeout = setTimeout(() => {
      onLoaded?.();
    }, 300); // You can tweak this or tie it to real load events

    return () => clearTimeout(timeout);
  }, [onLoaded]);

  return (
    <Suspense fallback={<OrbitProgress color="#000" size="large" />}>
      <div className="w-full sm:w-[60%] lg:w-1/2 flex justify-center items-center">
        <motion.div
          className="flex size-full max-w-xs sm:max-w-sm lg:max-w-lg items-center justify-center mb-10 sm:mb-0"
          animate={{ x: 0 }}
          transition={{ duration: 0.3, ease: "linear" }}
        >
          <IconCloud iconSlugs={slugs} />
        </motion.div>
      </div>
    </Suspense>
  );
};

export default IconSlugs;
