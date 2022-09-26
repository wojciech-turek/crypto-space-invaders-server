import { Router } from "express";

const router = Router();

// validate signature
// validate score
// save score

// highscores are saved in the smart contract
// high scores are kep in the client as well

// at the end of the leage we want to check if score tables match in the client and in the smart contract
// if the is a discrepancy we need to resolve it
router.get("/save", async (req, res) => {
  // verify signature with the signature used to create game
  res.send("Score saved!");
});

export default router;
