import express from "express";
import * as categoryController from "../controllers/categoryController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", categoryController.getAll);
router.post("/", verifyToken, requireRole("admin"), categoryController.create);

export default router;