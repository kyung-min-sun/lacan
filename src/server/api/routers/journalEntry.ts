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
      const image = await openai.images.generate({
        prompt: `Create an image for the following dream, titled ${title}: ${text}`,
      });
      const imageUrl = image.data[0];
      if (!imageUrl?.url) return null;
      return await db.file.create({
        data: {
          name: title,
          url: imageUrl.url,
          createdById,
          entries: {
            create: {
              title,
              text,
              createdById,
            },
          },
        },
      });
    }),
});
