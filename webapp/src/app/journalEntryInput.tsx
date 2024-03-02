"use client";

import { useState } from "react";
import { type User } from "next-auth";
import { api } from "~/trpc/react";
import { type ImageFile, type JournalEntry } from "@prisma/client";
import { twMerge } from "tailwind-merge";

export function JournalEntryInput({
  user,
  onCreate,
  setIsLoading,
}: {
  user: User;
  setIsLoading: (isLoading: boolean) => void;
  onCreate: (entry: JournalEntry & { images: ImageFile[] }) => void;
}) {
  const [entry, setEntry] = useState<{ title: string; text: string }>({
    title: "",
    text: "",
  });
  const [error, setError] = useState<string>();

  const { mutateAsync: checkTask } = api.imageTask.checkTask.useMutation();
  const { mutateAsync: createEntry } = api.journalEntry.create.useMutation();

  const onSubmit = async () => {
    if (entry.title.length == 0 || entry.text.length == 0) {
      setError("sorry, entry can't be blank...");
      return;
    }

    setIsLoading(true);

    const newEntryPromise = createEntry({ ...entry, createdById: user.id });
    setEntry({ title: "", text: "" });

    const newEntry = await newEntryPromise;

    // TODO: fix this section of unsafe js

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (newEntry.tasks?.length > 0 && newEntry.tasks[0]?.id) {
      for (let i = 0; i < 20; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        const task = await checkTask({ id: newEntry.tasks[0]?.id });
        if (!task || !task.entry || !task.isComplete) continue;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        newEntry.images?.push(...task.entry?.images);
        break;
      }
    }

    setIsLoading(false);

    if (!newEntry) {
      setError("there was an issue with your submission...");
      return;
    }

    onCreate(newEntry);
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <input
        value={entry.title}
        className="rounded-md border border-gray-500 bg-black p-2 text-slate-300
        placeholder:text-gray-500 focus:outline-slate-800"
        placeholder="my dream"
        onChange={(e) =>
          setEntry((entry) => ({ ...entry, title: e.target.value }))
        }
      />
      <textarea
        className="min-h-40 rounded-md rounded-sm border border-gray-500 bg-black p-2 text-xs text-slate-300 placeholder:text-gray-500 focus:outline-slate-800"
        placeholder="a description of your dream"
        value={entry.text}
        onChange={(e) =>
          setEntry((entry) => ({ ...entry, text: e.target.value }))
        }
      />
      {error && <div>{error}</div>}
      <div className="flex flex-row place-content-end">
        <button
          className={twMerge(
            "w-fit rounded-md border border-gray-500 px-4 py-2 text-sm text-gray-500",
            entry.title?.length > 0 && entry.text?.length > 0
              ? "border-slate-300 text-slate-300 hover:bg-gray-500/40"
              : "",
          )}
          onClick={onSubmit}
        >
          Save
        </button>
      </div>
    </div>
  );
}
