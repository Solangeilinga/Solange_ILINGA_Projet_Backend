
export const validateId = (req, res, next) => {
  
  const paramValue = req.params.id ?? req.params.article_id;
  const id = Number(paramValue);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: "ID invalide — doit être un entier positif" });
  }
  next();
};