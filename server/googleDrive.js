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

export async function getPhotos() {
  const photos = [];
  let pageToken = null;

  do {
    const response = await drive.files.list({
      q: "'1_NY0CPR3-_tOp-Evu6s0pJAkplPPeJjY' in parents and mimeType contains 'image/' and trashed = false",

      fields:
        "nextPageToken, files(id, name, mimeType, thumbnailLink, webContentLink)",

      spaces: "drive",
      pageToken,
      pageSize: 100,
    });

    photos.push(...response.data.files);
    pageToken = response.data.nextPageToken;
  } while (pageToken);

  photos.sort((a, b) => a.name.localeCompare(b.name));

  return photos;
}
