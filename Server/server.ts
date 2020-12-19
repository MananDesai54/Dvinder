import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(bodyParser.json());

app.listen(PORT, () =>
  console.log(`Server is running at http://127.0.0.1:${PORT}/`)
);
