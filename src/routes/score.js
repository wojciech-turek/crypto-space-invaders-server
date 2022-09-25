import { Router } from "express";

const router = Router();

// validate signature
// validate score
// save score

router.get("/save", async (req, res) => {
  res.send("Score saved!");
});

export default router;
