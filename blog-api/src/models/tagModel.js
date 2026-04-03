import db from "../config/db.js";


export const getAllTags = async () => {
  const [rows] = await db.query("SELECT * FROM tags ORDER BY name ASC");
  return rows;
};


export const createTag = async (name) => {
  const [result] = await db.query(
    "INSERT INTO tags (name) VALUES (?)",
    [name.trim().toLowerCase()]
  );
  return result;
};


export const findOrCreateTag = async (name) => {
  const clean = name.trim().toLowerCase();
  const [rows] = await db.query("SELECT * FROM tags WHERE name = ?", [clean]);
  if (rows.length > 0) return rows[0];

  const [result] = await db.query("INSERT INTO tags (name) VALUES (?)", [clean]);
  return { id: result.insertId, name: clean };
};


export const setArticleTags = async (article_id, tagNames) => {
  await db.query("DELETE FROM articles_tags WHERE article_id = ?", [article_id]);

  if (!tagNames || tagNames.length === 0) return;


  const tags = await Promise.all(
    tagNames.map((name) => findOrCreateTag(name))
  );


  const values = tags.map((tag) => [article_id, tag.id]);
  await db.query("INSERT IGNORE INTO articles_tags (article_id, tag_id) VALUES ?", [values]);
};