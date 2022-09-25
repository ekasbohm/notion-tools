export default async function searchTracks(searchTerm: string) {
  const searchRes = await fetch("/api/spotify", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      variables: { searchTerm },
      query: `query SearchSpotify($searchTerm: String!) {
        searchTracks(searchTerm: $searchTerm) {
          id
          name
          album {
            albumTitle
            art
            artists
            releaseDate
          }
        }
      }`,
    }),
  });
  const {
    data: { searchTracks: results },
  } = await searchRes.json();
  return results;
}
