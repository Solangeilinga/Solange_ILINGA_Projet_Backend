import db from "../config/db.js";

// Créer un article
export const createArticle = async (article) => {
  const { titre, auteur, contenu, categorie_id, statut = "brouillon", image } = article;

  const [result] = await db.query(
    "INSERT INTO articles (titre, auteur, contenu, categorie_id, statut, image) VALUES (?, ?, ?, ?, ?, ?)",
    [titre, auteur, contenu, categorie_id, statut, image || null]
  );
  return result;
};

// Récupérer tous les articles publiés (avec catégorie, likes, tags)
export const getAllArticles = async ({ statut, categorie_id, search } = {}) => {
  let query = `
    SELECT a.*, c.name AS categorie,
      (SELECT COUNT(*) FROM likes WHERE article_id = a.id) AS nb_likes,
      GROUP_CONCAT(t.name SEPARATOR ',') AS tags
    FROM articles a
    LEFT JOIN categories c ON a.categorie_id = c.id
    LEFT JOIN articles_tags at2 ON a.id = at2.article_id
    LEFT JOIN tags t ON at2.tag_id = t.id
    WHERE 1=1
  `;
  const params = [];

  if (statut) { query += " AND a.statut = ?"; params.push(statut); }
  if (categorie_id) { query += " AND a.categorie_id = ?"; params.push(categorie_id); }
  if (search) { query += " AND (a.titre LIKE ? OR a.contenu LIKE ?)"; params.push(`%${search}%`, `%${search}%`); }

  query += " GROUP BY a.id ORDER BY a.date_creation DESC";

  const [rows] = await db.query(query, params);
  return rows.map((r) => ({ ...r, tags: r.tags ? r.tags.split(",") : [] }));
};

// Récupérer un article par ID
export const getArticleById = async (id) => {
  const [rows] = await db.query(
    `SELECT a.*, c.name AS categorie,
      (SELECT COUNT(*) FROM likes WHERE article_id = a.id) AS nb_likes,
      GROUP_CONCAT(t.name SEPARATOR ',') AS tags
     FROM articles a
     LEFT JOIN categories c ON a.categorie_id = c.id
     LEFT JOIN articles_tags at2 ON a.id = at2.article_id
     LEFT JOIN tags t ON at2.tag_id = t.id
     WHERE a.id = ?
     GROUP BY a.id`,
    [id]
  );
  if (!rows[0]) return null;
  return { ...rows[0], tags: rows[0].tags ? rows[0].tags.split(",") : [] };
};

// Incrémenter les vues
export const incrementViews = async (id) => {
  await db.query("UPDATE articles SET vues = vues + 1 WHERE id = ?", [id]);
};

// Modifier un article
export const updateArticle = async (id, article) => {
  const { titre, auteur, contenu, categorie_id, statut, image } = article;
  const [result] = await db.query(
    "UPDATE articles SET titre=?, auteur=?, contenu=?, categorie_id=?, statut=?, image=? WHERE id=?",
    [titre, auteur, contenu, categorie_id, statut, image || null, id]
  );
  return result;
};

// Supprimer un article
export const deleteArticle = async (id) => {
  const [result] = await db.query("DELETE FROM articles WHERE id = ?", [id]);
  return result;
};

// Articles similaires (même catégorie, sauf lui-même)
export const getSimilarArticles = async (id, categorie_id) => {
  const [rows] = await db.query(
    `SELECT id, titre, auteur, date_creation,
      (SELECT COUNT(*) FROM likes WHERE article_id = a.id) AS nb_likes
     FROM articles a
     WHERE categorie_id = ? AND id != ? AND statut = 'publie'
     ORDER BY date_creation DESC LIMIT 5`,
    [categorie_id, id]
  );
  return rows;
};