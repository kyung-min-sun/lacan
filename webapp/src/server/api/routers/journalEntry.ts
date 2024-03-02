import { createTRPCRouter, protectedProcedure } from "../trpc";

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
      return await db.journalEntry.create({
        data: {
          title,
          text,
          createdById,
          tasks: { create: {} },
        },
        include: { images: true, tasks: true },
      });
    }),
});
