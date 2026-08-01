function BadgeSymbol({ symbol }: { symbol: string }) {
  return (
    <span className="flex size-10 items-center justify-center rounded-full border-2 border-[#f4c552] bg-[#f8e3a0] text-lg font-black text-[#1d5a45] shadow-[inset_0_0_0_3px_#ca4b30]">
      {symbol}
    </span>
  );
}
