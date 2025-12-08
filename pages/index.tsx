import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";

const Game = dynamic(() => import("../components/game"), { ssr: false });

export default function Index() {
  return (
    <>
      <Head>
        <title>Flikitrivia</title>
        <link
          rel="shortcut icon"
          href="public/favicon.ico"
        />
      </Head>

      <Game />
    </>
  );
}
