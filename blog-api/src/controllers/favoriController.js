import * as Favori from "../models/favoriModel.js";
import * as Article from "../models/articleModel.js";


export const toggleFavori = async (req, res) => {
  try {
    const article_id = req.params.id;
    const user_id = req.user.id;

    const article = await Article.getArticleById(article_id);
    if (!article) return res.status(404).json({ message: "Article non trouvé" });

    const already = await Favori.favoriExists(user_id, article_id);

    if (already) {
      await Favori.removeFavori(user_id, article_id);
      return res.json({ message: "Retiré des favoris", saved: false });
    } else {
      await Favori.addFavori(user_id, article_id);
      return res.json({ message: "Ajouté aux favoris", saved: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getMyFavoris = async (req, res) => {
  try {
    const favoris = await Favori.getFavorisByUser(req.user.id);
    res.json(favoris);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};