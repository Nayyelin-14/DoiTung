import React, { lazy } from "react";
const Homepage = lazy(() => import("../Appcomponents/HomePage/Homepage"));

const Home = () => {
  return (
    <section>
      <Homepage />
    </section>
  );
};

export default Home;
