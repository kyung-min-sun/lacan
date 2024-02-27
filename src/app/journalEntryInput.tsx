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
    <div className="flex w-full flex-col gap-2 p-4">
      <input
        value={entry.title}
        className="rounded-md border border-gray-300 bg-black p-2 text-slate-300
        placeholder:text-gray-500 focus:outline-slate-500"
        placeholder="My Dream"
        onChange={(e) =>
          setEntry((entry) => ({ ...entry, title: e.target.value }))
        }
      />
      <textarea
        className="min-h-40 rounded-md rounded-sm border border-gray-300 bg-black p-2 text-xs text-slate-300 text-slate-800 focus:outline-slate-500"
        value={entry.text}
        onChange={(e) =>
          setEntry((entry) => ({ ...entry, text: e.target.value }))
        }
      />
      {error && <div>{error}</div>}
      <div className="flex flex-row place-content-end">
        <button
          className="w-fit rounded-md bg-slate-50 px-4 py-2 text-sm hover:bg-opacity-80"
          onClick={onSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
