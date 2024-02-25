"use client";

import { type User } from "next-auth";
import { useFindManyJournalEntry } from "~/lib/hooks";
import { JournalEntryInput } from "./journalEntryInput";
import Image from "next/image";

export function JournalEntryFeed({ user }: { user: User }) {
  const { data: journalEntries, mutate } = useFindManyJournalEntry({
    include: { file: true },
  });
  return (
    <div>
      <JournalEntryInput user={user} onCreate={mutate} />
      <section className="flex flex-col gap-2 p-2">
        {journalEntries?.map((entry) => (
          <div className="border" key={entry.id}>
            <Image src={entry.file?.url ?? ""} alt={entry.title} />
            <h3>{entry.title}</h3>
            <span>{entry.text}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
