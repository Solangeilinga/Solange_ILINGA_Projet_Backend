import express from "express";
import * as articleController from "../controllers/articleController.js";
import * as likeController from "../controllers/likeController.js";
import * as favoriController from "../controllers/favoriController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { validateId } from "../middleware/validateId.js";

const router = express.Router();


router.get("/",                           articleController.getAll);
router.get("/:id",        validateId,     articleController.getOne);
router.get("/:id/related",validateId,     articleController.getSimilar);


router.post("/",    verifyToken, requireRole("auteur", "admin"), upload.single("image"), articleController.create);
router.put("/:id",  validateId, verifyToken, requireRole("auteur", "admin"), upload.single("image"), articleController.update);
router.delete("/:id",validateId,verifyToken, requireRole("auteur", "admin"), articleController.remove);


router.post("/:id/like", validateId, verifyToken, likeController.toggleLike);
router.post("/:id/save", validateId, verifyToken, favoriController.toggleFavori);

export default router;