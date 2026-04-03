import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes     from "./routes/authRoutes.js";
import articleRoutes  from "./routes/articleRoutes.js";
import commentRoutes  from "./routes/commentRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import tagRoutes      from "./routes/tagRoutes.js";
import favoriRoutes   from "./routes/favoriRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(helmet());


app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
}));

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/auth",       authRoutes);
app.use("/articles",   articleRoutes);
app.use("/comments",   commentRoutes);
app.use("/categories", categoryRoutes);
app.use("/tags",       tagRoutes);
app.use("/favoris",    favoriRoutes);


app.get("/", (req, res) => {
  res.json({ message: "API Blog — Serveur opérationnel" });
});


app.use((req, res) => {
  res.status(404).json({ message: "Route non trouvée" });
});


app.use((err, req, res, next) => {
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "Fichier trop volumineux (5 MB maximum)" });
    }
    return res.status(400).json({ message: err.message });
  }
  
  if (err.message && err.message.includes("Format d'image")) {
    return res.status(400).json({ message: err.message });
  }
  console.error(err.stack);
  res.status(500).json({ message: "Erreur interne du serveur" });
});

export default app;