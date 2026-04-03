import * as Category from "../models/categoryModel.js";

export const getAll = async (req, res) => {
  try {
    const categories = await Category.getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Le nom de la catégorie est requis" });
    }
    const result = await Category.createCategory(name.trim());
    res.status(201).json({ message: "Catégorie ajoutée avec succès", id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};