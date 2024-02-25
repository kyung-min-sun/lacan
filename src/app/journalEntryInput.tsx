"use client";

import { useState } from "react";
import { type User } from "next-auth";
import { JournalEntrySubmitButton } from "./submit";

export function JournalEntryInput({
  user,
  onCreate,
}: {
  user: User;
  onCreate: () => void;
}) {
  const [entry, setEntry] = useState<{ title: string; text: string }>({
    title: "Your Title",
    text: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>();

  return (
    <div className="p-2">
      <input
        value={entry.title}
        onChange={(e) =>
          setEntry((entry) => ({ ...entry, title: e.target.value }))
        }
      />
      <textarea
        className="text-xs"
        value={entry.text}
        onChange={(e) =>
          setEntry((entry) => ({ ...entry, text: e.target.value }))
        }
      />
    </div>
  );
}
