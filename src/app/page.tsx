import { JournalEntryFeed } from "./journalEntryFeed";
import { db } from "~/server/db";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

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
      <Link href="" className="p-4 flex flex-row items-center gap-2 text-gray-300">
        <Image src="./icon.svg" alt="logo" className="w-6" height={100} width={100}/>
        <h1>lacan</h1>
      </Link>
      <JournalEntryFeed journalEntries={journalEntries} user={session.user} />
    </main>
  );
}
