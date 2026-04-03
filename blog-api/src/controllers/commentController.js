import * as Comment from "../models/commentModel.js";
import * as Article from "../models/articleModel.js";


export const create = async (req, res) => {
  try {
    const { auteur, contenu, article_id, parent_id } = req.body;

    if (!auteur || !contenu || !article_id) {
      return res.status(400).json({ message: "Les champs auteur, contenu et article_id sont requis" });
    }

    const article = await Article.getArticleById(article_id);
    if (!article) return res.status(404).json({ message: "Article associé non trouvé" });

    if (parent_id) {
      const parent = await Comment.getCommentById(parent_id);
      if (!parent) return res.status(404).json({ message: "Commentaire parent non trouvé" });
      if (parent.article_id != article_id) {
        return res.status(400).json({ message: "Le commentaire parent n'appartient pas à cet article" });
      }
    }

    const result = await Comment.createComment({
      auteur,
      contenu,
      article_id,
      parent_id,
      user_id: req.user.id,
    });

    res.status(201).json({ message: "Commentaire ajouté avec succès", id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getByArticle = async (req, res) => {
  try {
    const article = await Article.getArticleById(req.params.article_id);
    if (!article) return res.status(404).json({ message: "Article non trouvé" });

    const comments = await Comment.getCommentsByArticle(req.params.article_id);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const remove = async (req, res) => {
  try {
    const comment = await Comment.getCommentById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Commentaire non trouvé" });

    const isOwner = comment.user_id === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Vous ne pouvez supprimer que vos propres commentaires" });
    }

    await Comment.deleteComment(req.params.id);
    res.json({ message: "Commentaire supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};