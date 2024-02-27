"use client";

import { type User } from "next-auth";
import { useState } from "react";
import { JournalEntryInput } from "./journalEntryInput";
import { type JournalEntry } from "@prisma/client";
import { JournalEntryCard } from "./journalEntryCard";
import { CircularLoadingMeter } from "./circularProgressBar";

export function JournalEntryFeed({
  user,
  journalEntries,
}: {
  user: User;
  journalEntries: (JournalEntry & { images: { s3Key: string }[] })[];
}) {
  const [entries, setEntries] = useState<typeof journalEntries>(journalEntries);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const today = new Date();
  const todayEntry = entries.find(
    (entry) =>
      entry.createdAt.getDate() == today.getDate() &&
      entry.createdAt.getMonth() == today.getMonth() &&
      entry.createdAt.getFullYear() == today.getFullYear(),
  );

  const writeEntry = (todayEntry == undefined && !isLoading) || true;
  const loadEntry = (todayEntry == undefined && isLoading) || false;

  return (
    <div className="p-4" style={{ maxWidth: 600 }}>
      {writeEntry ? (
        <JournalEntryInput
          user={user}
          setIsLoading={setIsLoading}
          onCreate={(newEntry) => setEntries((e) => [...e, newEntry])}
        />
      ) : loadEntry ? (
        <div className="flex flex-row items-center">
          <CircularLoadingMeter timeLimit="medium" size={120} />
        </div>
      ) : (
        <section className="flex flex-col items-center gap-4">
          {entries
            .sort((e1, e2) => e2.createdAt.getTime() - e1.createdAt.getTime())
            .map((entry) => (
              <JournalEntryCard entry={entry} key={entry.id} />
            ))}
        </section>
      )}
    </div>
  );
}
