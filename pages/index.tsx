import React from "react";
import Head from "next/head";
import BookSearch from "./BookSearch";

export default function Home() {
  return (
    <div style={{ width: "95%" }}>
      <Head>
        <title>Notion Tools</title>
      </Head>

      <main>
        <h1>Notion Tools</h1>
        <BookSearch />

        <h2>Songs</h2>
        <input placeholder="Search for a song" />
      </main>
    </div>
  );
}
