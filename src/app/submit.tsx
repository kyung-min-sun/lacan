import { api } from "~/trpc/server";

export function JournalEntrySubmitButton({
  entry,
  setError,
  onSubmit: _onSubmit,
}: {
  entry: {
    title: string;
    text: string;
    createdById: string;
  };
  setError: (value: string) => void;
  onSubmit: () => void;
}) {
  const onSubmit = async () => {
    if (entry.title.length == 0 || entry.text.length == 0) {
      setError("sorry, entry can't be blank...");
      return;
    }
    const newEntry = await api.journalEntry.create.mutate({
      ...entry,
    });
    if (!newEntry) {
      setError("there was an issue with your submission...");
      return;
    }
    _onSubmit();
  };
  return (
    <button className="border p-2" onClick={onSubmit}>
      Submit
    </button>
  );
}
