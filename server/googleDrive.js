import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";

let auth;

if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
  // Vercel
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);

  auth = new GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });
} else {
  // Local
  auth = new GoogleAuth({
    keyFile: "./server/credentials/service-account.json",
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });
}

const drive = google.drive({
  version: "v3",
  auth,
});

const ROOT_FOLDER_ID = "1_NY0CPR3-_tOp-Evu6s0pJAkplPPeJjY";

async function listFolderContents(folderId) {
  const files = [];
  let pageToken = null;

  do {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields:
        "nextPageToken, files(id, name, mimeType, thumbnailLink, webContentLink)",
      spaces: "drive",
      pageToken,
      pageSize: 100,
    });

    files.push(...response.data.files);
    pageToken = response.data.nextPageToken;
  } while (pageToken);

  return files;
}

async function collectPhotos(folderId, folderPath = "") {
  const contents = await listFolderContents(folderId);

  const photos = [];

  for (const item of contents) {
    if (item.mimeType === "application/vnd.google-apps.folder") {
      const nestedPath = folderPath ? `${folderPath}/${item.name}` : item.name;

      const nestedPhotos = await collectPhotos(item.id, nestedPath);

      photos.push(...nestedPhotos);
      continue;
    }

    if (item.mimeType?.startsWith("image/")) {
      photos.push({
        ...item,
        folderPath,
      });
    }
  }

  return photos;
}

export async function getPhotos() {
  const photos = await collectPhotos(ROOT_FOLDER_ID);

  photos.sort((a, b) => {
    const pathA = a.folderPath ? `${a.folderPath}/${a.name}` : a.name;

    const pathB = b.folderPath ? `${b.folderPath}/${b.name}` : b.name;

    return pathA.localeCompare(pathB);
  });

  return photos;
}
