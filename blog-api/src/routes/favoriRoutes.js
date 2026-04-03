import express from "express";
import * as favoriController from "../controllers/favoriController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, favoriController.getMyFavoris);

export default router;