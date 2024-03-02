import { CircularProgress } from "@mui/material";
import { useProgress } from "./useProgress";

export function CircularLoadingMeter({
  timeLimit,
  size = 15,
}: {
  timeLimit: "short" | "medium" | "long";
  size?: number;
}) {
  const interval = timeLimit == "short" ? 40 : timeLimit == "medium" ? 20 : 5;

  const { progress } = useProgress(interval, 5);

  return (
    <CircularProgress
      variant="determinate"
      value={progress ?? 0}
      size={size}
      className="text-gray-300"
      thickness={1}
    />
  );
}
