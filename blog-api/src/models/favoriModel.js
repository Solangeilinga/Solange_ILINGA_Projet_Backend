import db from "../config/db.js";


export const favoriExists = async (user_id, article_id) => {
  const [rows] = await db.query(
    "SELECT id FROM favoris WHERE user_id = ? AND article_id = ?",
    [user_id, article_id]
  );
  return rows.length > 0;
};

export const addFavori = async (user_id, article_id) => {
  const [result] = await db.query(
    "INSERT INTO favoris (user_id, article_id) VALUES (?, ?)",
    [user_id, article_id]
  );
  return result;
};


export const removeFavori = async (user_id, article_id) => {
  const [result] = await db.query(
    "DELETE FROM favoris WHERE user_id = ? AND article_id = ?",
    [user_id, article_id]
  );
  return result;
};


export const getFavorisByUser = async (user_id) => {
  const [rows] = await db.query(
    `SELECT a.id, a.titre, a.auteur, a.date_creation, c.name AS categorie
     FROM favoris f
     JOIN articles a ON f.article_id = a.id
     LEFT JOIN categories c ON a.categorie_id = c.id
     WHERE f.user_id = ?
     ORDER BY f.created_at DESC`,
    [user_id]
  );
  return rows;
};