import { Router } from "express";

const router = Router();

router.get("/address", async (_, res) => {
  // return current contract address
  res.send({
    contractAddress: process.env.CONTRACT_ADDRESS,
  });
});

export default router;
