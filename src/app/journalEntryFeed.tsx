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

  const writeEntry = todayEntry == undefined && !isLoading;
  const loadEntry = todayEntry == undefined && isLoading;

  return (
    <div className="flex min-h-screen w-full flex-1 flex-col items-center">
      {writeEntry ? (
        <div className="flex h-full w-96 flex-1 flex-row items-center">
          <JournalEntryInput
            user={user}
            setIsLoading={setIsLoading}
            onCreate={(newEntry) => setEntries((e) => [...e, newEntry])}
          />
        </div>
      ) : loadEntry ? (
        <div className="flex flex-1 flex-row items-center">
          <CircularLoadingMeter timeLimit="long" size={120} />
        </div>
      ) : (
        <section className="flex w-96 flex-col items-center gap-4 p-4">
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
