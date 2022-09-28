import { Router } from "express";
import Game from "../models/game";

const router = Router();

router.get("/", async (req, res) => {
  // get 10 games from the database with the highest score and return them
  const topScores = await Game.find({ ended: true, score: { $gt: 0 } })
    .sort({ score: -1 })
    .limit(10)
    .select(["score", "creatorAddress"]);
  res.send(topScores);
});

export default router;
