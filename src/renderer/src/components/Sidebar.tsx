import { Wallet, LayoutDashboard, List, PlusCircle, Lightbulb } from 'lucide-react'
import type { ActiveView } from '../App'

interface SidebarProps {
  activeView: ActiveView
  setActiveView: (view: ActiveView) => void
  balance: number
  totalIncome: number
  totalExpenses: number
  transactionCount: number
}

const fmt = (n: number): string =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function Sidebar({
  activeView,
  setActiveView,
  balance,
  totalIncome,
  totalExpenses,
  transactionCount,
}: SidebarProps): React.JSX.Element {
  const navItems: { id: ActiveView; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: <List className="w-4 h-4" />,
      badge: String(transactionCount),
    },
    { id: 'add', label: 'Add Transaction', icon: <PlusCircle className="w-4 h-4" /> },
    { id: 'insights', label: 'Insights', icon: <Lightbulb className="w-4 h-4" />, badge: 'New' },
  ]

  return (
    <aside className="w-52 flex-shrink-0 h-screen bg-white border-r border-border flex flex-col">
      {/* Logo */}
      <div className="h-14 flex items-center gap-2.5 px-4 border-b border-border flex-shrink-0">
        <div className="w-7 h-7 bg-ink rounded-lg flex items-center justify-center flex-shrink-0">
          <Wallet className="w-4 h-4 text-white" />
        </div>
        <span className="text-base font-semibold text-ink tracking-tight">FinTrack</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2.5 pt-3">
        <p className="text-[10px] font-semibold text-faint uppercase tracking-widest px-2 mb-1">
          Menu
        </p>
        {navItems.slice(0, 3).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium cursor-pointer mb-0.5 transition-colors ${
              activeView === item.id
                ? 'bg-active-nav text-ink font-semibold'
                : 'text-muted hover:text-ink hover:bg-hover'
            }`}
          >
            {item.icon}
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <span className="text-[10px] font-semibold bg-border text-muted px-1.5 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}

        <p className="text-[10px] font-semibold text-faint uppercase tracking-widest px-2 mb-1 mt-4">
          Insights
        </p>
        {navItems.slice(3).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium cursor-pointer mb-0.5 transition-colors ${
              activeView === item.id
                ? 'bg-active-nav text-ink font-semibold'
                : 'text-muted hover:text-ink hover:bg-hover'
            }`}
          >
            {item.icon}
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <span className="text-[10px] font-semibold bg-income-bg text-income px-1.5 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}

      </nav>

      {/* Bottom Stats */}
      <div className="mt-auto border-t border-border pt-3 px-3.5 pb-4">
        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] text-faint uppercase tracking-wide font-medium">
              Balance
            </span>
            <span className="font-mono text-sm font-semibold text-ink">RM {fmt(balance)}</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] text-faint uppercase tracking-wide font-medium">
              Income
            </span>
            <span className="font-mono text-sm font-semibold text-income">+RM {fmt(totalIncome)}</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] text-faint uppercase tracking-wide font-medium">
              Expenses
            </span>
            <span className="font-mono text-sm font-semibold text-expense">
              -RM {fmt(totalExpenses)}
            </span>
          </div>
        </div>
      </div>

      {/* Version */}
      <div className="px-3.5 pb-3 border-t border-border pt-2">
        <span className="text-[10px] text-faint font-mono">v{__APP_VERSION__}</span>
      </div>
    </aside>
  )
}
