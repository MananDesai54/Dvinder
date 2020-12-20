import { buildSchema } from "graphql";

export const schema = buildSchema(`
  type RootQuery{
  }

  type RootMutation {
  }

  schema {
    query: RootQuery,
    mutation: RootMutation
  }
`);
