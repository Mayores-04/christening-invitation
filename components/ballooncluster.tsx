import { motion } from "framer-motion";

export function BalloonCluster({ className = "" }: { className?: string }) {
  const balloons = [
    { color: "#f59e0b", x: 38, y: 4 },
    { color: "#ef4444", x: 12, y: 24 },
    { color: "#22c55e", x: 66, y: 28 },
    { color: "#3b82f6", x: 46, y: 42 },
    { color: "#a855f7", x: 4, y: 54 },
    { color: "#f97316", x: 78, y: 58 },
  ];

  return (
    <motion.div
      animate={{ y: [0, -10, 0], rotate: [0, 1.5, 0, -1.5, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      className={`pointer-events-none absolute ${className}`}
      aria-hidden="true"
    >
      <div className="relative h-[180px] w-[140px]">
        {balloons.map((balloon, index) => (
          <span
            key={balloon.color}
            className="absolute rounded-[50%_50%_46%_46%] border border-white/40 shadow-lg"
            style={{
              backgroundColor: balloon.color,
              left: `${balloon.x}%`,
              top: `${balloon.y}%`,
              width: 38,
              height: 50,
              transform: `rotate(${index % 2 === 0 ? -7 : 7}deg)`,
            }}
          />
        ))}
        {balloons.map((balloon, index) => (
          <span
            key={`${balloon.color}-line`}
            className="absolute h-px origin-left bg-[#7c5b3b]/45"
            style={{
              left: `${balloon.x + 9}%`,
              top: `${balloon.y + 32}%`,
              width: 105,
              transform: `rotate(${82 + index * 3}deg)`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
