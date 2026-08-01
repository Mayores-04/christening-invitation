import { cn } from "@/lib/utils";

export function Stamp({
  className = "",
  label,
}: {
  className?: string;
  label: string;
}) {
  return (
    <div
      className={cn(
        "absolute rounded-full border-2 border-[#c48b43]/45 bg-[#fff1cb]/60 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#99602a] backdrop-blur-sm",
        className,
      )}
      aria-hidden="true"
    >
      {label}
    </div>
  );
}
