import { AnimatePresence, motion } from "framer-motion";

export function CountdownUnit({
  value,
  label,
}: {
  value: number | null;
  label: string;
}) {
  const displayValue = value === null ? "--" : String(value).padStart(2, "0");

  return (
    <motion.div
      whileHover={{
        y: -6,
        rotate: value !== null && value % 2 === 0 ? -1.5 : 1.5,
      }}
      className="relative overflow-hidden rounded-2xl border-2 border-[#d7a74c] bg-[#fff7d8] px-3 py-4 text-center shadow-[5px_7px_0_#8a4b29] sm:px-5"
    >
      <span className="absolute -right-3 -top-4 size-12 rounded-full bg-[#f4c75e]/35" />
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.strong
          key={`${label}-${displayValue}`}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="relative block font-mono text-2xl font-black text-[#6d361e] sm:text-4xl"
        >
          {displayValue}
        </motion.strong>
      </AnimatePresence>
      <span className="relative mt-1 block text-[9px] font-black uppercase tracking-[0.18em] text-[#a46936] sm:text-[10px]">
        {label}
      </span>
    </motion.div>
  );
}
