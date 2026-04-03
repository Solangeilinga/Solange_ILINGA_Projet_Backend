import express from "express";
import * as tagController from "../controllers/tagController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", tagController.getAll);
router.post("/", verifyToken, requireRole("admin"), tagController.create);

export default router;