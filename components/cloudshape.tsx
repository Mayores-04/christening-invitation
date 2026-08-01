export function CloudShape({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute ${className}`} aria-hidden="true">
      <div className="relative h-24 w-44 opacity-80">
        <span className="absolute bottom-0 left-4 h-14 w-32 rounded-full bg-white/90" />
        <span className="absolute bottom-5 left-8 size-16 rounded-full bg-white/95" />
        <span className="absolute bottom-7 left-[4.5rem] size-20 rounded-full bg-white" />
        <span className="absolute bottom-4 right-5 size-14 rounded-full bg-white/95" />
      </div>
    </div>
  );
}
