import { Router } from "express";
import getNonce from "../controllers/AccountController";
import auth from "../middleware/auth";

const router = Router();

router.get("/nonce/:address", auth, getNonce);

export default router;
