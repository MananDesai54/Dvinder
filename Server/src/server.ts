import dotenv from "dotenv";
import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import microConfig from "./mikro-orm.config";
import express from "express";
import { PROD } from "./constants";
import morgan from "morgan";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { UserResolver } from "./resolvers/user";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./config/types";

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
  app.use(express.json());
  app.get("/", (_, res) => {
    res.json({
      message: "API Running",
    });
  });

  /**
   * Connect to redis
   * to store sessions
   * ==> How this exactly work <==
   * 1. When user login we set userId to session object in req
   * the we passes in session will be stored in redis as value with some cryptic key
      i.e- sess:cryptic-key -> { userId: 1 }
   * 2. then express-session middleware cookie will be set with the give data and the value will be signed version( SignedKey ) of that cryptic key
   * 3. now when we send a req that cookie will be send to server ( SignedKey )
   * 4. server find the cryptic key from that signed key by decrypting it ( SignedKey -> cryptic key )
   * 5. then server request for the value for that cryptic key in redis to get user data ( sess:cryptic-key -> { userId: 1 } )
   * so data will be available on res.session = { userId: 1 } so we can auto-login the year
   */

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(
    session({
      name: process.env.COOKIE_NAME,
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
        // disableTTL: true
      }),
      secret: process.env.REDIS_SECRET,
      resave: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        secure: PROD, // cookie only work in https
        sameSite: "lax", // related to csrf
      },
      saveUninitialized: false,
    })
  );

  /**
   * Setup Apollo server for graphQL
   */
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({
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
