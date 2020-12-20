import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";

// import { graphqlHTTP } from "express-graphql";
// import { schema } from "./graphql/schema";

dotenv.config();

const app: express.Application = express();
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cors());
app.use(bodyParser.json());

// app.use(
//   "/graphql",
//   graphqlHTTP({
//     schema,
//     rootValue: null,
//     graphiql: true,
//   })
// );

app.get("/", (req, res) => {
  res.send("API Running");
});

app.listen(PORT, () =>
  console.log(`Server is running at http://127.0.0.1:${PORT}/`)
);
