import { motion } from "framer-motion";

export function ScoutBadgeRow() {
  const badges = ["⌂", "✿", "★", "✈", "▲", "✦", "⚑", "☀"];
  const lane = [...badges, ...badges, ...badges, ...badges, ...badges];

  return (
    <div className="overflow-hidden border-y-4 border-[#194f3e] bg-[#163f32] py-2 shadow-inner">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 24,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        }}
        className="flex w-max will-change-transform"
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0 items-center gap-2 pr-2"
            aria-hidden={copy === 1}
          >
            {lane.map((badge, index) => (
              <span
                key={`${copy}-${badge}-${index}`}
                className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-[#f4c552] bg-[#f8e3a0] text-lg font-black text-[#1d5a45] shadow-[inset_0_0_0_3px_#ca4b30]"
              >
                {badge}
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
