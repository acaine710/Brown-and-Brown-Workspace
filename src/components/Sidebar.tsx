import {
  BarChart2,
  Bell,
  BookOpen,
  Home,
  LayoutGrid,
  Search,
} from 'lucide-react';

type Tab = 'dashboard' | 'quotes' | 'analytics' | 'alerts' | 'carriers';

interface Props {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
  alertCount: number;
}

const NAV_ITEMS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <Home size={18} /> },
  { id: 'quotes', label: 'Quotes', icon: <Search size={18} /> },
  { id: 'alerts', label: 'Alerts', icon: <Bell size={18} /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={18} /> },
  { id: 'carriers', label: 'Carriers', icon: <BookOpen size={18} /> },
];

export default function Sidebar({ activeTab, onChange, alertCount }: Props) {
  return (
    <aside className="w-56 shrink-0 bg-gradient-to-b from-[#1a1f36] to-[#252b45] text-white flex flex-col shadow-xl">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <LayoutGrid size={22} className="text-blue-400" />
          <div>
            <div className="font-bold text-sm leading-tight">Brown & Brown</div>
            <div className="text-xs text-blue-300">In-Flight Quotes</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === activeTab;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
              {item.id === 'alerts' && alertCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {alertCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/10 text-xs text-gray-400">
        <div>B&B Insurance</div>
        <div>Demo · April 2025</div>
      </div>
    </aside>
  );
}
