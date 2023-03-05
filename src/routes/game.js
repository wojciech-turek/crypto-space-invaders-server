import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import Account from "../models/account";
import Game from "../models/game";
import extractAddress from "../utils/extractAddress";
import validateSignature from "../utils/validateSignature";
import auth from "../middleware/auth";
import shooterContract from "../contract/shooter-contract";
import { ethers } from "ethers";

const router = Router();

// on new game creation send game id to the client
router.post("/start", auth, async (req, res) => {
  const address = extractAddress(req, res);
  const signature = req.body.signature;

  let isValidsignature = await validateSignature(address, signature);
  if (!isValidsignature)
    return res.status(400).json({
      status: "invalid signature",
    });

  const account = await Account.findOne({ address });
  if (!account)
    return res.status(400).json({
      status: "invalid address",
    });
  account.gamesPlayed += 1;
  await account.save();

  const currentLeague = await shooterContract.leagueNumber();

  const gameId = uuidv4();
  // create game
  const newGame = new Game({
    id: gameId,
    ended: false,
    creatorAddress: address,
    leagueNumber: currentLeague,
    signature: signature,
    createdAt: Date.now(),
  });

  await newGame.save();
  // send game id to the client
  res.send({
    gameId: gameId,
    message: "Game created!",
  });
});

router.post("/end", async (req, res) => {
  const gameId = req.body.gameId;
  const score = req.body.score;
  const address = extractAddress(req, res);
  const game = await Game.findOne({ id: gameId });
  if (!game) {
    return res.status(400).json({
      status: "failed",
      data: "invalid game id",
    });
  }
  if (game.ended) {
    return res.status(400).json({
      status: "failed",
      data: "game already ended",
    });
  }
  if (game.creatorAddress != address) {
    return res.status(400).json({
      status: "failed",
      data: "invalid address",
    });
  }

  game.ended = true;
  game.score = parseInt(score);
  await game.save();

  // get high score from the smart contract

  setHighScore(score, address);

  // get all games and calculate rank for current league
  const currentLeague = await shooterContract.leagueNumber();

  const games = await Game.find({ leagueNumber: parseInt(currentLeague) });
  const sortedGames = games.sort((a, b) => b.score - a.score);
  const rank = sortedGames.findIndex((game) => game.id == gameId) + 1;

  return res.json({
    gameId: gameId,
    rank: rank,
    status: "success",
    data: "game ended",
  });
});

export default router;

async function setHighScore(score, address) {
  const MAX_RETRIES = 5;
  let retries = 0;
  while (retries < MAX_RETRIES) {
    const highestScore = await shooterContract.highestScore();
    if (score > highestScore) {
      try {
        const tx = await shooterContract.setHighestScore(score, address);
        await tx.wait();
        return;
      } catch {
        retries += 1;
      }
    } else {
      return;
    }
  }

  return res.status(400).json({
    status: "failed",
    data: "failed to set high score",
  });
}
