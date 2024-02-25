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
    <div className="border">
      <Image
        src={imageStr?.[0] ? `data:image/png;base64,${imageStr[0]}` : ""}
        width={80}
        height={80}
        alt={entry.title}
      />
      <h3>{entry.title}</h3>
      <span>{entry.text}</span>
    </div>
  );
}
