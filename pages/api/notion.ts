import { createServer } from "@graphql-yoga/node";
import { Client } from "@notionhq/client";

const typeDefs = `
  type Book {
    title: String
    author: String
    cover: String
  }

  type Query {
    searchBooks(title: String!): [Book]!
  }

  type Mutation {
    addBook(title: String!, author: String, cover: String): Book
  }
`;

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const resolvers = {
  Query: {
    searchBooks: async (_: any, args: { title: string }) => {
      const { results } = await notion.databases.query({
        database_id: process.env.BOOKS_DB_ID,
        filter: { property: "Title", title: { equals: args.title } },
      });
      return results.map((result) => ({
        // @ts-ignore-next-line
        title: result.properties.Title.title[0].text.content,
      }));
    },
  },
  Mutation: {
    addBook: async (
      _: any,
      args: { title: string; author: string; cover?: string }
    ) => {
      const response = await notion.pages.create({
        parent: { database_id: process.env.BOOKS_DB_ID },
        properties: {
          Title: { title: [{ text: { content: args.title } }] },
          Author: { multi_select: [{ name: args.author }] },
        },
        cover: { external: { url: args.cover || "" } },
      });
      return response;
    },
  },
};

const server = createServer({
  schema: {
    typeDefs,
    resolvers,
  },
  endpoint: "/api/notion",
});

export default server;
