import "dotenv/config";

import express from "express";
import cors from "cors";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";

import { getPhotos } from "./googleDrive.js";
import { testR2Connection, getR2SignedUrl } from "./r2.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// SERVIR O REACT
// ==========================================

app.use(express.static(path.join(__dirname, "../dist")));

// ==========================================
// SESSÃO
// ==========================================

app.set("trust proxy", 1);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  }),
);

// ==========================================
// CORS
// ==========================================

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

// ==========================================
// JSON
// ==========================================

app.use(express.json());

// ==========================================
// LOGIN
// ==========================================

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

// ==========================================
// VERIFICAR SESSÃO
// ==========================================

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

// ==========================================
// MIDDLEWARE DE PROTEÇÃO
// ==========================================

function requireAuth(req, res, next) {
  if (req.session.isAuthenticated) {
    return next();
  }

  res.status(401).json({
    error: "Não autenticado",
  });
}

// ==========================================
// LISTA DE FOTOS
// ==========================================

app.get("/api/photos", requireAuth, async (req, res) => {
  try {
    const photos = await getPhotos();

    const photosWithUrls = await Promise.all(
      photos.map(async (photo) => {
        const extension = photo.name.split(".").pop();

        const thumbnailName = photo.name.replace(/\.[^/.]+$/, ".webp");

        const thumbnailKey = `thumbnails/${thumbnailName}`;
        const originalKey = `originals/${photo.name}`;

        const [thumbnailUrl, originalUrl] = await Promise.all([
          getR2SignedUrl(thumbnailKey),
          getR2SignedUrl(originalKey),
        ]);

        return {
          id: photo.id,
          name: photo.name,
          mimeType: photo.mimeType,
          extension,
          thumbnailUrl,
          originalUrl,
        };
      }),
    );

    res.json(photosWithUrls);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erro ao obter as fotos",
    });
  }
});

// ==========================================
// SPA FALLBACK
// ==========================================

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

// ==========================================
// START
// ==========================================

const PORT = process.env.PORT || 3000;

testR2Connection()
  .then(() => {
    console.log("R2 conectado com sucesso");
  })
  .catch((error) => {
    console.error("Erro na ligação ao R2:", error);
  });

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});
