import "dotenv/config";

import { google } from "googleapis";
import { GoogleAuth } from "google-auth-library";
import sharp from "sharp";

import { getPhotos } from "./googleDrive.js";
import { uploadToR2, r2FileExists } from "./r2.js";

const auth = new GoogleAuth({
  keyFile: process.env.RENDER
    ? "/etc/secrets/service-account.json"
    : "./server/credentials/service-account.json",
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

const drive = google.drive({
  version: "v3",
  auth,
});

async function migrate() {
  console.log("A procurar fotografias no Google Drive...");

  // TESTE: apenas 3 fotografias
  const photos = await getPhotos();

  console.log(`Encontradas ${photos.length} fotografias.`);

  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];

    try {
      console.log(`[${i + 1}/${photos.length}] A processar ${photo.name}...`);

      const response = await drive.files.get(
        {
          fileId: photo.id,
          alt: "media",
        },
        {
          responseType: "arraybuffer",
        },
      );

      const originalBuffer = Buffer.from(response.data);

      // -------------------------
      // ORIGINAL
      // -------------------------

      const originalKey = `originals/${photo.name}`;

      const originalExists = await r2FileExists(originalKey);

      if (!originalExists) {
        await uploadToR2(originalKey, originalBuffer, photo.mimeType);

        console.log(`✓ Original enviada: ${photo.name}`);
      } else {
        console.log(`✓ Original já existe: ${photo.name}`);
      }

      // -------------------------
      // THUMBNAIL
      // -------------------------

      const thumbnailKey = `thumbnails/${photo.name.replace(
        /\.[^/.]+$/,
        ".webp",
      )}`;

      const thumbnailExists = await r2FileExists(thumbnailKey);

      if (!thumbnailExists) {
        const thumbnailBuffer = await sharp(originalBuffer)
          .resize({
            width: 600,
            withoutEnlargement: true,
          })
          .webp({
            quality: 80,
          })
          .toBuffer();

        await uploadToR2(thumbnailKey, thumbnailBuffer, "image/webp");

        const originalMB = (originalBuffer.length / 1024 / 1024).toFixed(2);

        const thumbnailKB = (thumbnailBuffer.length / 1024).toFixed(0);

        console.log(
          `✓ Thumbnail criada: ${thumbnailKey} (${thumbnailKB} KB vs ${originalMB} MB)`,
        );
      } else {
        console.log(`✓ Thumbnail já existe: ${thumbnailKey}`);
      }
    } catch (error) {
      console.error(`✗ Erro em ${photo.name}:`, error.message);
    }
  }

  console.log("Migração de teste terminada.");
}

migrate().catch((error) => {
  console.error("Erro na migração:", error);
});
