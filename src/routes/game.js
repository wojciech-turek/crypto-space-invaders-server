import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import Account from "../models/account";
import Game from "../models/game";
import extractAddress from "../utils/extractAddress";
import validateSignature from "../utils/validateSignature";

const router = Router();

// on new game creation send game id to the client
router.get("/start", async (req, res) => {
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

  const gameId = uuidv4();
  // create game
  const newGame = new Game({
    id: gameId,
    ended: false,
    creatorAddress: address,
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

export default router;
