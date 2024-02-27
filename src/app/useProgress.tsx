import { useEffect, useState } from "react";

export function useProgress(interval: number, startValue = 0) {
  const [progress, setProgress] = useState<number>(startValue);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        const diff = Math.random() * interval;
        return Math.min(oldProgress + diff, 99);
      });
    }, 500);

    return () => {
      clearInterval(timer);
      setProgress(0);
    };
  }, [interval]);

  return { progress };
}
