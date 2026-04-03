import * as User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis (username, email, password)" });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Format d'email invalide" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caractères" });
    }

    const exists = await User.emailExists(email);
    if (exists) return res.status(409).json({ message: "Cet email est déjà utilisé" });

    
    const allowedRoles = ["lecteur", "auteur"];
    const assignedRole = allowedRoles.includes(role) ? role : "lecteur";

    const result = await User.createUser({ username, email, password, role: assignedRole });
    res.status(201).json({ message: "Utilisateur créé avec succès", id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Format d'email invalide" });
    }

    const user = await User.getUserByEmail(email);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Connexion réussie",
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getProfile = async (req, res) => {
  try {
    const user = await User.getUserById(req.user.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const { bio } = req.body;
    const avatar = req.file ? `/uploads/${req.file.filename}` : undefined;

    const current = await User.getUserById(req.user.id);
    if (!current) return res.status(404).json({ message: "Utilisateur non trouvé" });

    await User.updateProfile(req.user.id, {
      bio: bio !== undefined ? bio : current.bio,
      avatar: avatar !== undefined ? avatar : current.avatar,
    });

    res.json({ message: "Profil mis à jour avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email requis" });
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Format d'email invalide" });
    }

    const user = await User.getUserByEmail(email);
    
    if (!user) {
      return res.json({ message: "Si cet email existe, un lien de réinitialisation a été envoyé" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

    await User.saveResetToken(email, token, expires);

    
    res.json({
      message: "Token de réinitialisation généré",
      reset_token: token, 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { token, new_password } = req.body;

    if (!token || !new_password) {
      return res.status(400).json({ message: "Token et nouveau mot de passe requis" });
    }
    if (new_password.length < 6) {
      return res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caractères" });
    }

    const user = await User.getUserByResetToken(token);
    if (!user) return res.status(400).json({ message: "Token invalide ou expiré" });

    await User.updatePassword(user.id, new_password);
    await User.clearResetToken(user.id);

    res.json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};