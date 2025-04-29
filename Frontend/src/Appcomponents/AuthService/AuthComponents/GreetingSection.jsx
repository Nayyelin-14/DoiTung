import React, { Suspense, useState, useEffect } from "react";

// Dynamically import the TypingAnimation component
const TypingAnimation = React.lazy(() =>
  import("@/components/ui/typing-animation")
);

const GreetingSection = () => {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Render the "Mae Fah Luang" text regardless of screen size initially
  return (
    <section className="w-[45%] xl:w-[60%] lg:block flex-col items-center justify-center">
      {isLargeScreen && ( // Conditionally render the TypingAnimation on large screens
        <>
          <div className="mb-10">
            <h1 className="font-semibold text-3xl xl:text-6xl text-white">
              Mae Fah Luang
            </h1>
            <h1 className="font-semibold text-4xl xl:text-6xl text-white">
              Foundation
            </h1>
          </div>
          <div className="w-[80%]">
            {/* Lazy load the TypingAnimation component */}
            <Suspense fallback={<div>Loading...</div>}>
              <TypingAnimation className="text-lg text-white font-semibold xl:text-xl">
                {"Let's build a better community with Mae Fah Luang Foundation"}
              </TypingAnimation>
            </Suspense>
          </div>
        </>
      )}
    </section>
  );
};

export default GreetingSection;
