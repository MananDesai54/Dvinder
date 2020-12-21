import dotenv from "dotenv";
import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import microConfig from "./mikro-orm.config";
import express from "express";
import { PROD } from "./constants";
import morgan from "morgan";
import bodyParser from "body-parser";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { UserResolver } from "./resolvers/user";
dotenv.config();

const main = async () => {
  /**
   * Steps for Database connection with pg using mikro-orm:
   * First create entity and create microConfig and add it there
   * Create migration using CLI => npx mikro-orm migration:create
   * And use migrator in code to use migration and connect with database for doing CRUD
   */
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();

  /**
   * Preparing express server
   */
  const app = express();
  const PORT = process.env.PORT || 5000;
  if (!PROD) {
    app.use(morgan("dev"));
  }
  app.use(bodyParser.json());
  app.get("/", (_, res) => {
    res.json({
      message: "API Running",
    });
  });

  /**
   * Setup Apollo server for graphQL
   */
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver],
      validate: false,
    }),
    context: (req: express.Request, res: express.Response) => ({
      em: orm.em,
      req,
      res,
    }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(PORT, () =>
    console.log(`Server stated on http://127.0.0.1:${PORT}/`)
  );
};

main().catch((error) => {
  console.error(error);
});
