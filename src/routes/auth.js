import { Router } from "express";
import getToken from "../controllers/AuthController";

const router = Router();

router.post("/", getToken);

export default router;
