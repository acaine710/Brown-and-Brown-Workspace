import {
  BarChart2,
  Bell,
  BookOpen,
  Bot,
  Home,
  LayoutGrid,
  Layers,
} from 'lucide-react';

type Tab = 'dashboard' | 'pipeline' | 'analytics' | 'alerts' | 'carriers' | 'ai';

interface Props {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
  alertCount: number;
}

const NAV_ITEMS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <Home size={18} /> },
  { id: 'pipeline', label: 'Quote Pipeline', icon: <Layers size={18} /> },
  { id: 'alerts', label: 'Alerts', icon: <Bell size={18} /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={18} /> },
  { id: 'carriers', label: 'Carriers', icon: <BookOpen size={18} /> },
  { id: 'ai', label: 'AI Assistant', icon: <Bot size={18} /> },
];

export default function Sidebar({ activeTab, onChange, alertCount }: Props) {
  return (
    <aside className="w-56 shrink-0 bg-[#0C2340] flex flex-col shadow-lg">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#153658]">
        <div className="flex items-center gap-2">
          <LayoutGrid size={22} className="text-[#4A9EDF]" />
          <div>
            <div className="font-bold text-sm leading-tight text-white">Brown & Brown</div>
            <div className="text-xs text-[#4A9EDF]">In-Flight Quotes</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === activeTab;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#174F8F] text-white border-l-2 border-[#4A9EDF] rounded-r-md'
                  : 'text-[#8AAECC] hover:bg-[#153658] hover:text-white rounded-md'
              }`}
            >
              {item.icon}
              {item.label}
              {item.id === 'alerts' && alertCount > 0 && (
                <span className="ml-auto bg-[#A4262C] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {alertCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-[#153658] text-xs text-[#5B81A6]">
        <div>B&B Insurance</div>
        <div>Demo · April 2025</div>
      </div>
    </aside>
  );
}
