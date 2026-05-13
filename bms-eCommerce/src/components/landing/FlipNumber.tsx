import { motion } from "framer-motion";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function FlipDigit({ value, delay }: { value: number; delay: number }) {
  return (
    <span className="inline-block overflow-hidden h-[1em] leading-none align-bottom" style={{ width: "0.62em" }}>
      <motion.span
        className="flex flex-col leading-none"
        initial={{ y: 0 }}
        animate={{ y: `${-value}em` }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {DIGITS.map((d) => (
          <span key={d} className="h-[1em] leading-none flex items-center justify-center">{d}</span>
        ))}
      </motion.span>
    </span>
  );
}

export default function FlipNumber({ value, className }: { value: string | number; className?: string }) {
  const str = String(value);
  let digitIdx = -1;
  return (
    <span className={`inline-flex tabular-nums ${className ?? ""}`}>
      {str.split("").map((ch, i) => {
        if (/\d/.test(ch)) {
          digitIdx += 1;
          return <FlipDigit key={i} value={Number(ch)} delay={digitIdx * 0.06} />;
        }
        return <span key={i} className="inline-block leading-none">{ch}</span>;
      })}
    </span>
  );
}
