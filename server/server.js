import "dotenv/config";

import { migrate } from "./migrateToR2.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import { getPhotos } from "./googleDrive.js";
import { testR2Connection, getR2SignedUrl, r2FileExists } from "./r2.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// COOKIE
// ==========================================

app.use(cookieParser(process.env.SESSION_SECRET));

// ==========================================
// SERVIR O REACT
// ==========================================

app.use(express.static(path.join(__dirname, "../dist")));

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
    res.cookie("gallery_auth", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      signed: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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
// VERIFICAR AUTENTICAÇÃO
// ==========================================

app.get("/api/auth/me", (req, res) => {
  if (req.signedCookies.gallery_auth === "authenticated") {
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
  if (req.signedCookies.gallery_auth === "authenticated") {
    return next();
  }

  res.status(401).json({
    error: "Não autenticado",
  });
}

// ==========================================
// CRON - SINCRONIZAR FOTOS
// ==========================================

app.get("/api/cron/sync-photos", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({
      error: "Não autorizado",
    });
  }

  try {
    console.log("Cron: iniciar sincronização de fotos...");

    await migrate();

    console.log("Cron: sincronização terminada.");

    res.json({
      success: true,
      message: "Sincronização terminada",
    });
  } catch (error) {
    console.error("Cron: erro na sincronização:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ==========================================
// LISTA DE FOTOS
// ==========================================

app.get("/api/photos", requireAuth, async (req, res) => {
  try {
    const photos = await getPhotos();

    const photosWithUrls = await Promise.all(
      photos.map(async (photo) => {
        const extension = photo.name.split(".").pop();

        // Caminho da pasta
        const folderPrefix = photo.folderPath ? `${photo.folderPath}/` : "";

        // Nome da thumbnail
        const thumbnailName = photo.name.replace(/\.[^/.]+$/, ".webp");

        // Keys do R2
        const thumbnailKey = `thumbnails/${folderPrefix}${thumbnailName}`;
        const originalKey = `originals/${folderPrefix}${photo.name}`;

        // Verificar se a thumbnail já foi sincronizada
        const thumbnailExists = await r2FileExists(thumbnailKey);

        if (!thumbnailExists) {
          return null;
        }

        const [thumbnailUrl, originalUrl, downloadUrl] = await Promise.all([
          getR2SignedUrl(thumbnailKey),
          getR2SignedUrl(originalKey),
          getR2SignedUrl(originalKey, true, photo.name),
        ]);

        return {
          id: photo.id,
          name: photo.name,
          mimeType: photo.mimeType,
          extension,
          thumbnailUrl,
          originalUrl,
          downloadUrl,
          folderPath: photo.folderPath,
        };
      }),
    );

    // Remover fotos que ainda não existem no R2
    const availablePhotos = photosWithUrls.filter(Boolean);

    res.json(availablePhotos);
  } catch (error) {
    console.error("ERRO API PHOTOS:", error);

    res.status(500).json({
      error: error.message,
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

if (!process.env.VERCEL) {
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
}

export default app;
