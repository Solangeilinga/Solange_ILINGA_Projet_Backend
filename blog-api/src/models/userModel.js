import db from "../config/db.js";
import bcrypt from "bcryptjs";


export const createUser = async (user) => {
  const { username, email, password, role = "lecteur" } = user;
  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await db.query(
    "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
    [username, email, hashedPassword, role]
  );
  return result;
};


export const getUserByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};


export const getUserById = async (id) => {
  const [rows] = await db.query(
    "SELECT id, username, email, role, bio, avatar, created_at FROM users WHERE id = ?",
    [id]
  );
  return rows[0];
};


export const emailExists = async (email) => {
  const [rows] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
  return rows.length > 0;
};


export const updateProfile = async (id, { bio, avatar }) => {
  const [result] = await db.query(
    "UPDATE users SET bio = ?, avatar = ? WHERE id = ?",
    [bio, avatar, id]
  );
  return result;
};


export const updatePassword = async (id, newPassword) => {
  const hashed = await bcrypt.hash(newPassword, 10);
  const [result] = await db.query(
    "UPDATE users SET password = ? WHERE id = ?",
    [hashed, id]
  );
  return result;
};


export const saveResetToken = async (email, token, expires) => {
  const [result] = await db.query(
    "UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?",
    [token, expires, email]
  );
  return result;
};


export const getUserByResetToken = async (token) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()",
    [token]
  );
  return rows[0];
};


export const clearResetToken = async (id) => {
  await db.query(
    "UPDATE users SET reset_token = NULL, reset_token_expires = NULL WHERE id = ?",
    [id]
  );
};