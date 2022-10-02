import { Router } from "express";
import shooterContract from "../contract/shooter-contract";
import Game from "../models/game";

const router = Router();

router.get("/", async (req, res) => {
  const currentLeague = await shooterContract.leagueNumber();
  // get 10 games from the database with the highest score and return them
  const topScores = await Game.find({
    ended: true,
    currentLeague: currentLeague,
    score: { $gt: 0 },
  })
    .sort({ score: -1 })
    .limit(10)
    .select(["score", "creatorAddress"]);
  res.send(topScores);
});

export default router;
