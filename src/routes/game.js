import { Router } from "express";

const router = Router();

// on new game creation send game id to the client
router.get("/start", async (req, res) => {
  res.send("Game started!");
});

export default router;
