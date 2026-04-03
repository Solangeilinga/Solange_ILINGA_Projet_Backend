import * as Article from "../models/articleModel.js";
import * as Tag from "../models/tagModel.js";


export const create = async (req, res) => {
  try {
    const { titre, auteur, contenu, categorie_id, statut, tags } = req.body;

    if (!titre || !auteur || !contenu) {
      return res.status(400).json({ message: "Les champs titre, auteur et contenu sont requis" });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const result = await Article.createArticle({ titre, auteur, contenu, categorie_id, statut, image });

  
    if (tags) {
      const tagList = Array.isArray(tags) ? tags : tags.split(",");
      await Tag.setArticleTags(result.insertId, tagList);
    }

    res.status(201).json({ message: "Article créé avec succès", id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getAll = async (req, res) => {
  try {
    const { statut, categorie_id, search } = req.query;
    const articles = await Article.getAllArticles({ statut, categorie_id, search });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getOne = async (req, res) => {
  try {
    const article = await Article.getArticleById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article non trouvé" });

    await Article.incrementViews(req.params.id);
    res.json({ ...article, vues: article.vues + 1 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const update = async (req, res) => {
  try {
    const { titre, auteur, contenu, categorie_id, statut, tags } = req.body;

    if (!titre || !auteur || !contenu) {
      return res.status(400).json({ message: "Les champs titre, auteur et contenu sont requis" });
    }

    const article = await Article.getArticleById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article non trouvé" });

    const image = req.file ? `/uploads/${req.file.filename}` : article.image;
    await Article.updateArticle(req.params.id, { titre, auteur, contenu, categorie_id, statut, image });


    if (tags !== undefined) {
      const tagList = Array.isArray(tags) ? tags : tags.split(",");
      await Tag.setArticleTags(req.params.id, tagList);
    }

    res.json({ message: "Article modifié avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const remove = async (req, res) => {
  try {
    const article = await Article.getArticleById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article non trouvé" });

    await Article.deleteArticle(req.params.id);
    res.json({ message: "Article supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getSimilar = async (req, res) => {
  try {
    const article = await Article.getArticleById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article non trouvé" });

    if (!article.categorie_id) {
      return res.json([]);
    }

    const similaires = await Article.getSimilarArticles(req.params.id, article.categorie_id);
    res.json(similaires);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};