import {
  S3Client,
  HeadBucketCommand,
  HeadObjectCommand,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export async function testR2Connection() {
  const command = new HeadBucketCommand({
    Bucket: process.env.R2_BUCKET_NAME,
  });

  await r2.send(command);

  return true;
}

export async function uploadToR2(key, body, contentType) {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  await r2.send(command);
}

export async function r2FileExists(key) {
  try {
    const command = new HeadObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    });

    await r2.send(command);

    return true;
  } catch (error) {
    if (error.name === "NotFound") {
      return false;
    }

    throw error;
  }
}

export async function getR2SignedUrl(key) {
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(r2, command, {
    expiresIn: 3600,
  });
}
