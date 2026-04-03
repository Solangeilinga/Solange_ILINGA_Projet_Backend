import * as Tag from "../models/tagModel.js";


export const getAll = async (req, res) => {
  try {
    const tags = await Tag.getAllTags();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const create = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Le nom du tag est requis" });
    }

    const result = await Tag.createTag(name);
    res.status(201).json({ message: "Tag créé avec succès", id: result.insertId });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Ce tag existe déjà" });
    }
    res.status(500).json({ error: error.message });
  }
};