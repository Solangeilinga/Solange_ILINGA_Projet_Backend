import db from "../config/db.js";


export const likeExists = async (user_id, article_id) => {
  const [rows] = await db.query(
    "SELECT id FROM likes WHERE user_id = ? AND article_id = ?",
    [user_id, article_id]
  );
  return rows.length > 0;
};


export const addLike = async (user_id, article_id) => {
  const [result] = await db.query(
    "INSERT INTO likes (user_id, article_id) VALUES (?, ?)",
    [user_id, article_id]
  );
  return result;
};


export const removeLike = async (user_id, article_id) => {
  const [result] = await db.query(
    "DELETE FROM likes WHERE user_id = ? AND article_id = ?",
    [user_id, article_id]
  );
  return result;
};


export const countLikes = async (article_id) => {
  const [rows] = await db.query(
    "SELECT COUNT(*) AS total FROM likes WHERE article_id = ?",
    [article_id]
  );
  return rows[0].total;
};