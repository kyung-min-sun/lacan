"use client";

import { type User } from "next-auth";
import { useState } from "react";
import { JournalEntryInput } from "./journalEntryInput";
import { type JournalEntry } from "@prisma/client";
import { JournalEntryCard } from "./journalEntryCard";

export function JournalEntryFeed({
  user,
  journalEntries,
}: {
  user: User;
  journalEntries: (JournalEntry & { images: { s3Key: string }[] })[];
}) {
  const [entries, setEntries] = useState<typeof journalEntries>(journalEntries);
  return (
    <div className="flex flex-col gap-8 p-4">
      <JournalEntryInput
        user={user}
        onCreate={(newEntry) => setEntries((e) => [...e, newEntry])}
      />
      <section className="flex flex-col items-center gap-4">
        {entries.map((entry) => (
          <JournalEntryCard entry={entry} key={entry.id} />
        ))}
      </section>
    </div>
  );
}
