import React from "react";
import { GlobalFeed } from "./Feed/GlobalFeed";
import Head from "./Helper/Head";

const Home = () => {
  return (
    <section className="container mainContainer">
      <Head title="Feed" />
      <GlobalFeed />
    </section>
  );
};

export default Home;
