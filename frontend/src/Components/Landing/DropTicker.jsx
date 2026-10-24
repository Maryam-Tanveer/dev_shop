export default function DropTicker() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-4 pb-2 w-full flex flex-col gap-2">
      {/* Breadcrumb */}
      <div className="text-[11px] text-neutral-400 font-medium">
        <span>Home</span> <span className="mx-1">/</span> <span className="text-neutral-600">Shop Experience</span>
      </div>

      {/* Meta ticker line */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs pt-1 border-t border-neutral-200/50">
        <div className="font-extrabold tracking-wider uppercase text-[#c81d25] flex items-center gap-2">
          <span>HOME</span>
          <span className="text-neutral-300">/</span>
          <span>FALL STREETWEAR & DROP VAULT</span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-semibold text-neutral-500 tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c81d25] inline-block animate-pulse"></span>
          <span>Drops Verified Authenticated</span>
          <span className="text-neutral-300">•</span>
          <span>Real-Time Market Ticker</span>
        </div>
      </div>
    </div>
  )
}
