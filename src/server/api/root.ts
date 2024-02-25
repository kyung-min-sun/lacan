import { createTRPCRouter } from "~/server/api/trpc";
import { journalEntryRouter } from "./routers/journalEntry";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  journalEntry: journalEntryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
