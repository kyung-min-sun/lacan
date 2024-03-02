import { createTRPCRouter, protectedProcedure } from "../trpc";

import { type Key, MediaClient } from "~/server/clients/media.client";
import { z } from "zod";

export const s3Router = createTRPCRouter({
  getImage: protectedProcedure
    .input(
      z.object({
        s3Key: z.string(),
      }),
    )
    .query(async ({ input: { s3Key } }) => {
      return await MediaClient.get(s3Key as Key);
    }),
  getImages: protectedProcedure
    .input(
      z.object({
        images: z.array(
          z.object({
            s3Key: z.string(),
          }),
        ),
      }),
    )
    .query(async ({ input: { images } }) => {
      return await Promise.all(
        images.map(({ s3Key }) => MediaClient.get(s3Key as Key)),
      );
    }),
});
