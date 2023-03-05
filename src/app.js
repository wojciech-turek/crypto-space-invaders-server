import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import morganMiddleware from "./middleware/morgan";
import routes from "./routes";
import Logger from "./utils/logger";

const app = express();

const mongooseConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
app.use(morganMiddleware);
mongoose.connect(process.env.MONGO_URL, mongooseConfig);

const db = mongoose.connection;

db.on("error", (error) => {
  console.error(`[database] FATAL ERROR`, error);
});

db.once("open", async () => {
  console.log(`[database] Connected to database`);
});

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/score", routes.score);
app.use("/game", routes.game);
app.use("/account", routes.account);
app.use("/auth", routes.auth);
app.use("/data", routes.data);

app.listen(process.env.PORT || 5000, () =>
  Logger.info(`Shooter app listening on port ${process.env.PORT}!`)
);
