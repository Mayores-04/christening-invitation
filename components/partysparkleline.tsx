import { cn } from "@/lib/utils";

export function PartySparkleLine() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 text-[#c67b34]">
      {Array.from({ length: 13 }, (_, index) => (
        <span
          key={index}
          className={cn(
            "block rounded-full",
            index % 3 === 0 && "size-2.5 bg-[#d65f31]",
            index % 3 === 1 && "size-3 bg-[#f0be52]",
            index % 3 === 2 && "size-2.5 bg-[#2b5c47]",
          )}
        />
      ))}
    </div>
  );
}
