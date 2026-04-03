import db from "../config/db.js";


export const createComment = async (comment) => {
  const { auteur, contenu, article_id, parent_id = null, user_id } = comment;

  const [result] = await db.query(
    "INSERT INTO comments (auteur, contenu, article_id, parent_id, user_id) VALUES (?, ?, ?, ?, ?)",
    [auteur, contenu, article_id, parent_id, user_id]
  );
  return result;
};


export const getCommentsByArticle = async (article_id) => {
  const [rows] = await db.query(
    "SELECT * FROM comments WHERE article_id = ? ORDER BY date ASC",
    [article_id]
  );

  const parents = rows.filter((c) => c.parent_id === null);
  const children = rows.filter((c) => c.parent_id !== null);

  return parents.map((parent) => ({
    ...parent,
    reponses: children.filter((c) => c.parent_id === parent.id),
  }));
};


export const deleteComment = async (id) => {
  const [result] = await db.query("DELETE FROM comments WHERE id = ?", [id]);
  return result;
};


export const getCommentById = async (id) => {
  const [rows] = await db.query("SELECT * FROM comments WHERE id = ?", [id]);
  return rows[0];
};