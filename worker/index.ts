import { ImageTask, JournalEntry, PrismaClient } from "@prisma/client";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { OpenAI } from "openai";

const prisma = new PrismaClient();
const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.APP_AWS_ACCESS_KEY!,
    secretAccessKey: process.env.APP_AWS_SECRET_KEY!,
  },
  region: process.env.AWS_S3_REGION!,
});

async function saveFileToCloud(
  filename: string,
  data: Buffer | string,
  contentType?: string
): Promise<string> {
  const index = Math.floor(Math.random() * 1000);
  const key = `${index}-${filename}`;
  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: data,
      ContentType: contentType,
    })
  );
  return key;
}

async function generateImages({ title, text }: JournalEntry) {
  const openai = new OpenAI();
  const generation = await openai.images.generate({
    prompt: `Draw a painting for the following dream. Avoid writing letters and use a Cubist style. "${`${title}`.slice(0, 100)} : ${`${text}`.trim().replaceAll(/\s/, " ").slice(0, 500)}"`,
    response_format: "b64_json",
  });
  const imagesKeys = await Promise.all(
    generation.data
      .filter(
        (image): image is { b64_json: string } => image.b64_json !== undefined
      )
      .map(async ({ b64_json }, i) => ({
        s3Key: await saveFileToCloud(
          `${title}-${i}.png`,
          b64_json,
          "image/png"
        ),
      }))
  );
  return imagesKeys;
}

async function executeImageTask(imageTask: ImageTask) {
  const entry = await prisma.journalEntry.findFirst({
    where: { tasks: { some: { id: imageTask.id } } },
  });
  if (entry == null) return;

  const keys = await generateImages(entry);
  return await prisma.$transaction([
    prisma.imageTask.update({
      where: { id: imageTask.id },
      data: { isComplete: true },
    }),
    prisma.journalEntry.update({
      where: { id: entry.id },
      data: {
        images: {
          createMany: {
            data: keys.map(({ s3Key }) => ({
              s3Key,
              name: entry.title,
              createdById: entry.createdById,
            })),
          },
        },
      },
    }),
  ]);
}

function main() {
  const tasks: ImageTask[] = [];

  setInterval(async () => {
    const newTasks = await prisma.imageTask.findMany({
      where: { isComplete: false, id: { notIn: tasks.map(({ id }) => id) } },
      include: { entry: true },
    });
    if (newTasks.length > 0) {
      console.log(
        `new entries found: ${newTasks.map((task) => `${task.entry?.title}`).join(",")}`
      );
    }
    tasks.push(...newTasks);
    await Promise.all(newTasks.map((task) => executeImageTask(task)));
  }, 1000);
}

main();
