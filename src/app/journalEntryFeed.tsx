"use client";

import { type User } from "next-auth";
import Image from "next/image";
import { useState } from "react";
import { JournalEntryInput } from "./journalEntryInput";
import { type JournalEntry } from "@prisma/client";

export function JournalEntryFeed({
  user,
  journalEntries,
}: {
  user: User;
  journalEntries: (JournalEntry & { images: { url: string }[] })[];
}) {
  const [entries, setEntries] = useState<typeof journalEntries>(journalEntries);
  console.log(entries);
  return (
    <>
      <JournalEntryInput
        user={user}
        onCreate={(newEntry) => setEntries((e) => [...e, newEntry])}
      />
      <section className="flex flex-col gap-2 p-2">
        {entries.map((entry) => (
          <div className="border" key={entry.id}>
            <a href={entry.images[0]?.url ?? ""}>hi</a>
            <h3>{entry.title}</h3>
            <span>{entry.text}</span>
          </div>
        ))}
      </section>
    </>
  );
}
