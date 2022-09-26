import { Router } from "express";
import getNonce from "../controllers/AccountController";

const router = Router();

router.get("/nonce/:address", getNonce);

export default router;
