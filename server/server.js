import "dotenv/config";

import express from "express";
import cors from "cors";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";

import { getPhotos } from "./googleDrive.js";

import { google } from "googleapis";
import { GoogleAuth } from "google-auth-library";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../dist")));

// Sessão
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

// CORS
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

// Ler JSON enviado pelo React
app.use(express.json());

// LOGIN
app.post("/api/login", (req, res) => {
  const { password } = req.body;

  if (password === process.env.GALLERY_PASSWORD) {
    req.session.isAuthenticated = true;

    return res.json({
      success: true,
    });
  }

  res.status(401).json({
    success: false,
    error: "Password incorreta",
  });
});

// Verificar sessão
app.get("/api/auth/me", (req, res) => {
  if (req.session.isAuthenticated) {
    return res.json({
      isAuthenticated: true,
    });
  }

  res.status(401).json({
    isAuthenticated: false,
  });
});

// Middleware de proteção
function requireAuth(req, res, next) {
  if (req.session.isAuthenticated) {
    return next();
  }

  res.status(401).json({
    error: "Não autenticado",
  });
}

// Google Drive
const auth = new GoogleAuth({
  keyFile: "./server/credentials/service-account.json",
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

const drive = google.drive({
  version: "v3",
  auth,
});

// Lista de fotos (protegida)
app.get("/api/photos", requireAuth, async (req, res) => {
  try {
    const photos = await getPhotos();

    res.json(photos);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erro ao obter as fotos",
    });
  }
});

// Thumbnail (protegida)
app.get("/api/photos/:id/thumbnail", requireAuth, async (req, res) => {
  try {
    const response = await drive.files.get({
      fileId: req.params.id,
      fields: "thumbnailLink",
    });

    const thumbnailLink = response.data.thumbnailLink;

    if (!thumbnailLink) {
      return res.status(404).json({
        error: "Thumbnail não encontrada",
      });
    }

    const thumbnailResponse = await fetch(thumbnailLink);

    if (!thumbnailResponse.ok) {
      return res.status(500).json({
        error: "Erro ao obter a thumbnail",
      });
    }

    res.setHeader(
      "Content-Type",
      thumbnailResponse.headers.get("content-type") || "image/jpeg",
    );

    const buffer = Buffer.from(await thumbnailResponse.arrayBuffer());

    res.send(buffer);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erro ao obter a thumbnail",
    });
  }
});

// Imagem original (protegida)
app.get("/api/photos/:id", requireAuth, async (req, res) => {
  try {
    const response = await drive.files.get(
      {
        fileId: req.params.id,
        alt: "media",
      },
      {
        responseType: "stream",
      },
    );

    res.setHeader(
      "Content-Type",
      response.headers["content-type"] || "image/jpeg",
    );

    response.data.pipe(res);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erro ao obter a imagem",
    });
  }
});

// Download (protegido)
app.get("/api/photos/:id/download", requireAuth, async (req, res) => {
  try {
    const response = await drive.files.get(
      {
        fileId: req.params.id,
        alt: "media",
      },
      {
        responseType: "stream",
      },
    );

    const fileName = req.query.name || "photo.jpg";

    res.setHeader(
      "Content-Type",
      response.headers["content-type"] || "image/jpeg",
    );

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    response.data.pipe(res);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erro ao descarregar a imagem",
    });
  }
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});
