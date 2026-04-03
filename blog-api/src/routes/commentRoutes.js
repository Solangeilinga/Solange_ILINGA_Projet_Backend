import express from "express";
import * as commentController from "../controllers/commentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { validateId } from "../middleware/validateId.js";

const router = express.Router();

router.get("/article/:article_id", validateId, commentController.getByArticle);
router.post("/",                   verifyToken, commentController.create);
router.delete("/:id",  validateId, verifyToken, commentController.remove);

export default router;