import { type JournalEntry } from "@prisma/client";
import Image from "next/image";
import { api } from "~/trpc/react";

export function JournalEntryCard({
  entry,
}: {
  entry: JournalEntry & { images: { s3Key: string }[] };
}) {
  const { data: imageStr } = api.s3.getImages.useQuery({
    images: entry.images.map(({ s3Key }) => ({ s3Key })),
  });

  return (
    <div className="flex w-full flex-col gap-2 rounded-sm border bg-slate-200 p-4">
      <Image
        src={imageStr?.[0] ? `data:image/png;base64,${imageStr[0]}` : ""}
        width={300}
        height={300}
        alt={entry.title}
      />
      <div className="flex flex-row items-center gap-2">
        <h3 className="text-lg font-medium">{entry.title}</h3>
        <h4 className="text-sm font-normal">
          {entry.createdAt.toLocaleDateString()}
        </h4>
      </div>
      <span className="text-xs">{entry.text}</span>
    </div>
  );
}
