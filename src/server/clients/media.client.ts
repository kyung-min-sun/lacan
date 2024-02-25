import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { env } from "~/env";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export type Index = number;
export type Filename = string;
export type Key = `${Index}-${Filename}`;
export type MediaUrl = `http${"" | "s"}://${string}`;
export class MediaError extends Error {}

export class MediaClient {
  private static s3Client: S3Client = this.getClient();

  public static async get(key: Key): Promise<MediaUrl> {
    return (await getSignedUrl(
      this.s3Client,
      new GetObjectCommand({
        Bucket: env.AWS_S3_BUCKET,
        Key: key,
      }),
      { expiresIn: 3600 * 48 },
    )) as MediaUrl;
  }

  public static async save(
    filename: string,
    data: Buffer | string,
    contentType?: string,
  ): Promise<Key> {
    const index: Index = this.getIndex();
    const key: Key = `${index}-${filename}`;
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: env.AWS_S3_BUCKET,
        Key: key,
        Body: data,
        ContentType: contentType,
      }),
    );
    return key;
  }

  private static getIndex(): Index {
    return Math.floor(Math.random() * 10_000);
  }

  private static getClient(): S3Client {
    return new S3Client({
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY,
        secretAccessKey: env.AWS_SECRET_KEY,
      },
      region: process.env.S3_REGION!,
    });
  }
}
