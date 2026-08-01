import { motion } from "framer-motion";
import { ExternalLink, MapPin, Navigation } from "lucide-react";
import { ReactNode } from "react";

export function LocationCard({
  type,
  title,
  time,
  address,
  icon,
  onMap,
}: {
  type: string;
  title: string;
  time: string;
  address: string;
  icon: ReactNode;
  onMap: () => void;
}) {
  return (
    <motion.article
      whileHover={{ y: -8, rotate: type === "Ceremony" ? -0.5 : 0.5 }}
      className="relative overflow-hidden rounded-[2rem] border-2 border-[#d3b77a] bg-[#fffaf0] p-6 shadow-[10px_12px_0_#b6783f] sm:p-8"
    >
      <div className="absolute -right-12 -top-12 size-40 rounded-full bg-[#cde9f7] opacity-60 blur-2xl" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-[#214f3e] text-[#fff2bd] shadow-lg">
            {icon}
          </div>
          <span className="rounded-full bg-[#f7d976] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#71441d]">
            {type}
          </span>
        </div>
        <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-[#b16c32]">
          {time}
        </p>
        <h3 className="mt-2 font-serif text-3xl font-black text-[#264d3b]">
          {title}
        </h3>
        <p className="mt-4 flex items-start gap-3 text-sm leading-6 text-[#746b58]">
          <MapPin className="mt-1 size-4 shrink-0 text-[#bd6a30]" />
          {address}
        </p>
        <button
          type="button"
          onClick={onMap}
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#d76332] px-5 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#b94e24]"
        >
          <Navigation className="size-4" />
          View on Maps
          <ExternalLink className="size-3.5" />
        </button>
      </div>
    </motion.article>
  );
}
