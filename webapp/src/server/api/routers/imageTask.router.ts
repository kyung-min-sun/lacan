import { createTRPCRouter, protectedProcedure } from "../trpc";

import { z } from "zod";

export const imageTaskRouter = createTRPCRouter({
  checkTask: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx: { db }, input: { id } }) => {
      return await db.imageTask.findFirst({
        where: { id },
        include: { entry: { select: { images: true } } },
      });
    }),
});
