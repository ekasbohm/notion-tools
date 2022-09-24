declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOOKS_DB_ID: string;
      NOTION_TOKEN: string;
      NODE_ENV: "development" | "production";
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
