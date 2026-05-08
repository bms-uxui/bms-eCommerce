import { useEffect, useState } from "react";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function CountdownTimer({
  hours = 12,
  minutes = 0,
  seconds = 0,
}: {
  hours?: number;
  minutes?: number;
  seconds?: number;
}) {
  const [t, setT] = useState({ h: hours, m: minutes, s: seconds });
  useEffect(() => {
    const id = setInterval(() => {
      setT((prev) => {
        let { h, m, s } = prev;
        s -= 1;
        if (s < 0) {
          s = 59;
          m -= 1;
        }
        if (m < 0) {
          m = 59;
          h -= 1;
        }
        if (h < 0) h = 0;
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const Box = ({ value }: { value: string }) => (
    <span className="bg-[var(--color-neutral-900)] text-white text-xs sm:text-sm md:text-base font-bold rounded w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 flex items-center justify-center">
      {value}
    </span>
  );

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <Box value={pad(t.h)} />
      <span className="text-[var(--color-neutral-900)] font-bold">:</span>
      <Box value={pad(t.m)} />
      <span className="text-[var(--color-neutral-900)] font-bold">:</span>
      <Box value={pad(t.s)} />
    </div>
  );
}
