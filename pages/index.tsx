import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import BookSearch from "./BookSearch";
import searchTracks from "../music-fetchers";

export default function Home() {
  const [trackResults, setTrackResults] = useState([]);
  return (
    <div style={{ width: "95%" }}>
      <Head>
        <title>Notion Tools</title>
      </Head>

      <main>
        <h1>Notion Tools</h1>
        <BookSearch />

        <h2>Songs</h2>
        <input
          placeholder="Search for a song"
          defaultValue="hip to be a square"
          onChange={async ({ target: { value: searchTerm } }) => {
            const tracks = await searchTracks(searchTerm);
            setTrackResults(tracks);
          }}
        />
        {trackResults?.length > 0 && (
          <div className="search-suggestions">
            {trackResults.map((track) => {
              const {
                id,
                name,
                album: { albumTitle, releaseDate, artists, art },
              } = track;

              return (
                <div key={id} className="book-result">
                  <Image src={art} width={200} height={200} />
                  <p className="track-title">{name}</p>
                  <p className="album-artist">{artists}</p>
                  <p className="album-data">{albumTitle}</p>
                  <p className="album-data">
                    {new Date(releaseDate).toLocaleDateString()}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
