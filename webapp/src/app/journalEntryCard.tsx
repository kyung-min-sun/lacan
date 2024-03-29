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
    <div className="flex w-full flex-col gap-4 rounded-sm bg-black p-4 text-gray-300">
      {imageStr ? (
        <Image
          src={imageStr?.[0] ? `data:image/png;base64,${imageStr[0]}` : ""}
          className="w-96"
          width={300}
          height={300}
          alt={entry.title}
        />
      ) : (
        <></>
      )}
      <div className="flex flex-row items-center gap-2">
        <h3 className="text-lg font-medium">{entry.title}</h3>
        <h4 className="text-sm font-normal">
          {entry.createdAt.toLocaleDateString()}
        </h4>
      </div>
      <span className="whitespace-pre-wrap text-xs">{entry.text}</span>
    </div>
  );
}
