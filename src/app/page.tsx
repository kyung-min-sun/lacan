import { JournalEntryFeed } from "./journalEntryFeed";
import { db } from "~/server/db";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerAuthSession();
  const journalEntries = await db.journalEntry.findMany({
    where: { createdById: session?.user.id },
    include: { images: true },
  });

  if (!session) {
    return redirect("/api/auth/signin");
  }

  return (
    <main className="min-h-screen bg-black">
      <JournalEntryFeed journalEntries={journalEntries} user={session.user} />
    </main>
  );
}
