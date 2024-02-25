import { createTRPCRouter, protectedProcedure } from "../trpc";

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
      });
      return await db.journalEntry.create({
        data: {
          title,
          text,
          createdById,
          images: {
            createMany: {
              data: generation.data
                .filter(
                  (image): image is { url: string } => image.url !== undefined,
                )
                .map(({ url }) => ({ name: title, url, createdById })),
            },
          },
        },
        include: { images: true },
      });
    }),
});
