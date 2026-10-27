export default function AdminStats({
  totalDrops = 0,
  inStockCount = 0,
  lowStockCount = 0,
  soldOutCount = 0,
  avgPrice = 0,
}) {
  return (
    <section aria-label="Drop Inventory Metrics" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      <div className="bg-[#16161f] border border-white/10 rounded-2xl p-4">
        <div className="text-[11px] font-mono text-neutral-400 uppercase">Total Drops</div>
        <div className="text-2xl font-black text-white mt-1" aria-label={`Total drops: ${totalDrops}`}>
          {totalDrops}
        </div>
        <div className="text-[10px] text-neutral-500 mt-0.5">Catalog allocations</div>
      </div>

      <div className="bg-[#16161f] border border-emerald-500/20 rounded-2xl p-4">
        <div className="text-[11px] font-mono text-emerald-400 uppercase">In Stock</div>
        <div className="text-2xl font-black text-emerald-400 mt-1" aria-label={`In stock items: ${inStockCount}`}>
          {inStockCount}
        </div>
        <div className="text-[10px] text-neutral-500 mt-0.5">Ready for checkout</div>
      </div>

      <div className="bg-[#16161f] border border-amber-500/20 rounded-2xl p-4">
        <div className="text-[11px] font-mono text-amber-400 uppercase">Low Stock (FOMO)</div>
        <div className="text-2xl font-black text-amber-400 mt-1" aria-label={`Low stock items: ${lowStockCount}`}>
          {lowStockCount}
        </div>
        <div className="text-[10px] text-neutral-500 mt-0.5">3 or fewer left</div>
      </div>

      <div className="bg-[#16161f] border border-red-500/20 rounded-2xl p-4">
        <div className="text-[11px] font-mono text-red-400 uppercase">Sold Out</div>
        <div className="text-2xl font-black text-red-400 mt-1" aria-label={`Sold out items: ${soldOutCount}`}>
          {soldOutCount}
        </div>
        <div className="text-[10px] text-neutral-500 mt-0.5">Archive status</div>
      </div>

      <div className="bg-[#16161f] border border-white/10 rounded-2xl p-4 col-span-2 sm:col-span-1">
        <div className="text-[11px] font-mono text-neutral-400 uppercase">Avg Allocation</div>
        <div className="text-2xl font-black text-white mt-1" aria-label={`Average allocation price: $${avgPrice}`}>
          ${avgPrice}
        </div>
        <div className="text-[10px] text-neutral-500 mt-0.5">Per drop piece</div>
      </div>
    </section>
  )
}
