import { createTRPCRouter, protectedProcedure } from "../trpc";

import { MediaClient } from "~/server/clients/media.client";
import { OpenAI } from "openai";
import { z } from "zod";

export const journalEntryRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        text: z.string(),
        title: z.string(),
        createdById: z.string(),
      }),
    )
    .mutation(async ({ ctx: { db }, input: { text, title, createdById } }) => {
      const openai = new OpenAI();
      const generation = await openai.images.generate({
        prompt: `Create an image for the following dream, titled ${title}: ${text}`,
        response_format: "b64_json",
      });
      const imageKeys = await Promise.all(
        generation.data
          .filter(
            (image): image is { b64_json: string } =>
              image.b64_json !== undefined,
          )
          .map(async ({ b64_json }, i) => ({
            s3Key: await MediaClient.save(
              `${title}-${i}.png`,
              b64_json,
              "image/png",
            ),
          })),
      );

      return await db.journalEntry.create({
        data: {
          title,
          text,
          createdById,
          images: {
            createMany: {
              data: imageKeys.map(({ s3Key }) => ({
                name: title,
                s3Key,
                createdById,
              })),
            },
          },
        },
        include: { images: true },
      });
    }),
});
