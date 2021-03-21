import dotenv from "dotenv";
import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { PROD } from "./constants";
import morgan from "morgan";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { UserResolver } from "./resolvers/user";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./config/types";
import cors from "cors";
import { User } from "./entities/User";
import { Feed } from "./entities/Feed";
import { Reaction } from "./entities/Reaction";
import { FeedResolver } from "./resolvers/feed";
import path from "path";
import { Updoot } from "./entities/Updoot";
import { createUserLoader } from "./utils/createUserLoader";
import { createUpdootLoader } from "./utils/createUpdootLoader";
import { graphqlUploadExpress } from "graphql-upload";
import { View } from "./entities/View";
import { Match } from "./entities/Match";

dotenv.config();

const main = async () => {
  /**
   * Steps for Database connection with pg using mikro-orm/ typeorm:
   * First create entity and create microConfig/ typeormConfig and add it there
   * Create migration using CLI => npx mikro-orm migration:create or with typeorm auto migration or cli
   * And use migrator in code to use migration and connect with database for doing CRUD( For mikro-orm ), typeorm does it automatically
   */
  const conn = await createConnection({
    type: "postgres",
    database: process.env.PG_DB_NAME,
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    logging: true,
    synchronize: true,
    entities: [User, Feed, Reaction, Updoot, View, Match],
    migrations: [path.join(__dirname, "./migrations/*")],
  });
  await conn.runMigrations();

  /**
   * Preparing express server
   */
  const app = express();

  app.use(
    cors({
      origin: "http://127.0.0.1:3000",
      credentials: true,
    })
  );
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
  // const redisClient = redis.createClient();
  const redis = new Redis();

  app.use(
    session({
      name: process.env.COOKIE_NAME,
      store: new RedisStore({
        client: redis,
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

  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

  /**
   * Setup Apollo server for graphQL
   */
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver, FeedResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      updootLoader: createUpdootLoader(),
    }),
    uploads: false,
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(PORT, () =>
    console.log(`Server stated on http://127.0.0.1:${PORT}/`)
  );
};

main().catch((error) => {
  console.error(error);
});
