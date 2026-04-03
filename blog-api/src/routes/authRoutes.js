import express from "express";
import * as authController from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { authLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();


router.post("/register",       authLimiter, authController.register);
router.post("/login",          authLimiter, authController.login);
router.post("/forgot-password",authLimiter, authController.forgotPassword);


router.get("/profile", verifyToken, authController.getProfile);
router.put("/profile", verifyToken, upload.single("avatar"), authController.updateProfile);

router.post("/reset-password", authController.resetPassword);

export default router;