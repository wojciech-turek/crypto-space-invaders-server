import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import Account from "../models/account";
import Game from "../models/game";
import extractAddress from "../utils/extractAddress";
import validateSignature from "../utils/validateSignature";
import auth from "../middleware/auth";
import shooterContract from "../contract/shooter-contract";

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

  // get high score from the smart contract
  const highestScore = await shooterContract.highestScore();
  if (score > highestScore) {
    // update high score in the smart contract
    const tx = await shooterContract.setHighestScore(score, address);
    await tx.wait();
  }
  // save the score on the blockchain

  game.ended = true;
  game.score = score;

  await game.save();
  return res.json({
    gameId: gameId,
    status: "success",
    data: "game ended",
  });
});

export default router;
