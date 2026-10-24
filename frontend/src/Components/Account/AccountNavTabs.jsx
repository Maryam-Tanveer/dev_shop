import { DASHBOARD_TABS as tabs } from '../../data/orders'

export default function AccountNavTabs({
  activeTab = 'orders',
  onSelectTab
}) {

  return (
    <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-4 mb-6">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        const Icon = tab.icon

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab && onSelectTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition whitespace-nowrap active:scale-95 shadow-2xs ${
              isActive
                ? 'bg-[#c81d25] text-white shadow-xs'
                : 'bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200/90'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
            {tab.badge && (
              <span
                className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
