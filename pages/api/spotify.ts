import { createServer } from "@graphql-yoga/node";
import SpotifyWebApi from "spotify-web-api-node";

const typeDefs = `
  type Album {
    artists: String
    art: String
    albumTitle: String
    releaseDate: String
  }

  type Track {
    id: String
    album: Album
    name: String
  }

  type Query {
    searchTracks(searchTerm: String!): [Track]!
  }
`;

const spotify = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

const resolvers = {
  Query: {
    searchTracks: async (_: any, args: { searchTerm: string }) => {
      const {
        body: { access_token: token },
      } = await spotify.clientCredentialsGrant();
      spotify.setAccessToken(token);
      const {
        body: { tracks },
      } = await spotify.searchTracks(args.searchTerm, {
        limit: 7,
        market: "US",
      });
      return tracks?.items.map((item) => {
        const { id, name, album } = item;
        const {
          name: albumTitle,
          artists,
          images,
          release_date: releaseDate,
        } = album;
        return {
          id,
          name,
          album: {
            artists: artists.map((artist) => artist.name).join(", "),
            art: images[0].url,
            albumTitle,
            releaseDate,
          },
        };
      });
    },
  },
};

const server = createServer({
  schema: {
    typeDefs,
    resolvers,
  },
  endpoint: "/api/spotify",
});

export default server;
