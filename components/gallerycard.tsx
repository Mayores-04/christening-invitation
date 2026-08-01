import { motion } from "framer-motion";
import {
  Backpack,
  CalendarDays,
  Clock3,
  Compass,
  Gift,
  Users,
} from "lucide-react";

export function GalleryCard({
  title,
  description,
  badge,
  icon,
}: {
  title: string;
  description: string;
  badge?: string;
  icon: "setup" | "cake" | "backdrop" | "favors" | "memory" | "moments";
}) {
  const iconMap = {
    setup: <Backpack className="size-6" />,
    cake: <Gift className="size-6" />,
    backdrop: <CalendarDays className="size-6" />,
    favors: <Users className="size-6" />,
    memory: <Compass className="size-6" />,
    moments: <Clock3 className="size-6" />,
  } as const;

  return (
    <motion.article
      whileHover={{ y: -6, rotate: 0.35 }}
      className="group overflow-hidden rounded-[1.8rem] border-2 border-[#d8bc86] bg-[#fffdf7] shadow-[8px_10px_0_#ad7440]"
    >
      <div className="relative flex aspect-[4/4.2] flex-col justify-between overflow-hidden bg-[linear-gradient(180deg,#dff3fb_0%,#fff7dd_58%,#eef6e4_100%)] p-6">
        <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-[#f6d56f]/40 blur-2xl" />
        <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-[#b8e0c0]/35 blur-2xl" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-[#24523f] text-[#fff1bf] shadow-[4px_5px_0_#ad7440]">
            {iconMap[icon]}
          </div>
          {badge ? (
            <span className="rounded-full bg-[#d45f31] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">
              {badge}
            </span>
          ) : null}
        </div>
        <div className="relative mt-8">
          <p className="font-serif text-2xl font-black text-[#264f3b]">
            {title}
          </p>
          <p className="mt-3 text-sm leading-7 text-[#6f6b5d]">{description}</p>
        </div>
      </div>
    </motion.article>
  );
}
