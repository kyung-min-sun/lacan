"use client";

import { useState } from "react";
import { type User } from "next-auth";
import { api } from "~/trpc/react";
import { type ImageFile, type JournalEntry } from "@prisma/client";

export function JournalEntryInput({
  user,
  onCreate,
}: {
  user: User;
  onCreate: (entry: JournalEntry & { images: ImageFile[] }) => void;
}) {
  const [entry, setEntry] = useState<{ title: string; text: string }>({
    title: "",
    text: "",
  });
  const [error, setError] = useState<string>();

  const { mutateAsync: createEntry } = api.journalEntry.create.useMutation();

  const onSubmit = async () => {
    if (entry.title.length == 0 || entry.text.length == 0) {
      setError("sorry, entry can't be blank...");
      return;
    }

    const newEntryPromise = createEntry({ ...entry, createdById: user.id });
    setEntry({ title: "", text: "" });

    const newEntry = await newEntryPromise;

    if (!newEntry) {
      setError("there was an issue with your submission...");
      return;
    }
    onCreate(newEntry);
  };

  return (
    <div className="flex w-full flex-col gap-2 bg-slate-200 p-4">
      <input
        value={entry.title}
        className="rounded-sm p-2 text-slate-800 
        placeholder:text-gray-300 focus:outline-slate-500"
        placeholder="Your Title"
        onChange={(e) =>
          setEntry((entry) => ({ ...entry, title: e.target.value }))
        }
      />
      <textarea
        className="min-h-40 rounded-sm p-2 text-xs text-slate-800 focus:outline-slate-500"
        value={entry.text}
        onChange={(e) =>
          setEntry((entry) => ({ ...entry, text: e.target.value }))
        }
      />
      {error && <div>{error}</div>}
      <button
        className="w-fit rounded-sm border bg-slate-50 p-2 text-sm hover:bg-slate-100"
        onClick={onSubmit}
      >
        Submit
      </button>
    </div>
  );
}
