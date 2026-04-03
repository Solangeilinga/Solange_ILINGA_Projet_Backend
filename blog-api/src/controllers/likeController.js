import * as Like from "../models/likeModel.js";
import * as Article from "../models/articleModel.js";


export const toggleLike = async (req, res) => {
  try {
    const article_id = req.params.id;
    const user_id = req.user.id;

    const article = await Article.getArticleById(article_id);
    if (!article) return res.status(404).json({ message: "Article non trouvé" });

    const already = await Like.likeExists(user_id, article_id);

    if (already) {
      await Like.removeLike(user_id, article_id);
      const total = await Like.countLikes(article_id);
      return res.json({ message: "Like retiré", liked: false, nb_likes: total });
    } else {
      await Like.addLike(user_id, article_id);
      const total = await Like.countLikes(article_id);
      return res.json({ message: "Article liké", liked: true, nb_likes: total });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};