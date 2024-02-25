import { JournalEntryFeed } from "./journalEntryFeed";
import { getServerAuthSession } from "~/server/auth";

export default async function Home() {
  const session = await getServerAuthSession();

  return !session ? (
    <></>
  ) : (
    <main className="">
      <JournalEntryFeed user={session.user} />
    </main>
  );
}
