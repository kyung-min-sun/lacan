import Image from "next/image";
import { JournalEntryFeed } from "./journalEntryFeed";
import Link from "next/link";
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
    <main className="min-h-screen w-full bg-black">
      <Link
        href=""
        className="fixed flex flex-row items-center gap-2 p-4 text-gray-300"
      >
        <Image
          src="./icon.svg"
          alt="logo"
          className="w-6"
          height={100}
          width={100}
        />
        <h1>lacan</h1>
      </Link>
      <JournalEntryFeed journalEntries={journalEntries} user={session.user} />
    </main>
  );
}
