import { parseISO, startOfMonth, isSameMonth, subMonths } from 'date-fns'
import {
  Briefcase,
  Laptop,
  TrendingUp,
  Gift,
  ShoppingCart,
  Bus,
  Home,
  Tv,
  Heart,
  ShoppingBag,
  BookOpen,
  Circle,
} from 'lucide-react'
import type { Transaction, Category } from '../data/sampleData'
import type { LucideIcon } from 'lucide-react'

interface InsightsPanelProps {
  transactions: Transaction[]
}

const CATEGORY_ICONS: Record<Category, { icon: LucideIcon; bg: string; color: string }> = {
  Salary: { icon: Briefcase, bg: '#dcfce7', color: '#166534' },
  Freelance: { icon: Laptop, bg: '#dbeafe', color: '#1e40af' },
  Investment: { icon: TrendingUp, bg: '#ede9fe', color: '#5b21b6' },
  Gift: { icon: Gift, bg: '#fce7f3', color: '#9d174d' },
  Food: { icon: ShoppingCart, bg: '#fef3c7', color: '#92400e' },
  Transport: { icon: Bus, bg: '#e0f2fe', color: '#075985' },
  Housing: { icon: Home, bg: '#dbeafe', color: '#1e40af' },
  Entertainment: { icon: Tv, bg: '#fce7f3', color: '#9d174d' },
  Healthcare: { icon: Heart, bg: '#fee2e2', color: '#991b1b' },
  Shopping: { icon: ShoppingBag, bg: '#fef3c7', color: '#92400e' },
  Education: { icon: BookOpen, bg: '#ede9fe', color: '#5b21b6' },
  Other: { icon: Circle, bg: '#f3f4f6', color: '#6b7280' },
}

const fmt = (n: number): string =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function InsightsPanel({ transactions }: InsightsPanelProps): React.JSX.Element {
  const mostRecent =
    transactions.length > 0
      ? transactions.reduce((a, b) => (a.date > b.date ? a : b)).date
      : new Date().toISOString().split('T')[0]

  const currentMonth = startOfMonth(parseISO(mostRecent))
  const lastMonth = subMonths(currentMonth, 1)

  const currentMonthTxns = transactions.filter((t) =>
    isSameMonth(parseISO(t.date), currentMonth),
  )

  const lastMonthExpenses = transactions
    .filter((t) => t.type === 'expense' && isSameMonth(parseISO(t.date), lastMonth))
    .reduce((s, t) => s + t.amount, 0)

  const currentMonthExpenses = currentMonthTxns
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0)

  const currentMonthIncome = currentMonthTxns
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0)

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0)

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0)

  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0
  const clampedRate = Math.max(0, Math.min(100, savingsRate))

  const ringColor =
    clampedRate >= 20 ? '#2d6a4f' : clampedRate >= 10 ? '#d97706' : '#991b1b'

  const r = 44
  const cx = 60
  const cy = 60
  const circumference = 2 * Math.PI * r
  const dashArray = `${(clampedRate / 100) * circumference} ${circumference}`

  // Top spending category this month
  const categoryTotals = new Map<string, number>()
  currentMonthTxns
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categoryTotals.set(t.category, (categoryTotals.get(t.category) ?? 0) + t.amount)
    })
  const topCategory = Array.from(categoryTotals.entries()).sort((a, b) => b[1] - a[1])[0]

  // Biggest single expense this month
  const biggestExpense = currentMonthTxns
    .filter((t) => t.type === 'expense')
    .reduce(
      (max: Transaction | null, t) => (max === null || t.amount > max.amount ? t : max),
      null,
    )

  // Month-over-month
  const momDiff =
    lastMonthExpenses > 0
      ? Math.round(((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100)
      : null

  const topCategoryStyle = topCategory
    ? CATEGORY_ICONS[topCategory[0] as Category]
    : CATEGORY_ICONS.Other

  const TopIcon = topCategoryStyle.icon

  const biggestCategoryStyle = biggestExpense
    ? CATEGORY_ICONS[biggestExpense.category]
    : CATEGORY_ICONS.Other
  const BiggestIcon = biggestCategoryStyle.icon

  return (
    <div className="p-6 flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold text-ink">Spending Insights</h1>
        <p className="text-sm text-muted mt-0.5">Your financial health at a glance</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Card 1 — Top Spending Category */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <p className="text-[10px] font-semibold text-faint uppercase tracking-wider mb-3">
            Top Spending This Month
          </p>
          {topCategory ? (
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: topCategoryStyle.bg }}
              >
                <TopIcon className="w-6 h-6" style={{ color: topCategoryStyle.color }} />
              </div>
              <div>
                <p className="text-base font-semibold text-ink">{topCategory[0]}</p>
                <p className="font-mono text-lg font-bold text-expense mt-0.5">
                  RM {fmt(topCategory[1])}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted">No expenses this month</p>
          )}
        </div>

        {/* Card 2 — Savings Rate Ring */}
        <div className="bg-white rounded-2xl border border-border p-5 flex flex-col items-center justify-center">
          <p className="text-[10px] font-semibold text-faint uppercase tracking-wider mb-3 self-start">
            Savings Rate
          </p>
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={ringColor}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={dashArray}
              transform={`rotate(-90, ${cx}, ${cy})`}
            />
            <text
              x={cx}
              y={cy - 6}
              textAnchor="middle"
              fontSize="18"
              fontWeight="700"
              fontFamily="JetBrains Mono, monospace"
              fill={ringColor}
            >
              {Math.round(clampedRate)}%
            </text>
            <text
              x={cx}
              y={cy + 12}
              textAnchor="middle"
              fontSize="9"
              fill="#9ca3af"
              fontFamily="DM Sans, sans-serif"
            >
              of income saved
            </text>
          </svg>
        </div>

        {/* Card 3 — Month-over-Month */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <p className="text-[10px] font-semibold text-faint uppercase tracking-wider mb-3">
            Month-over-Month
          </p>
          <div className="mb-2">
            <p className="text-xs text-muted mb-0.5">This month&apos;s expenses</p>
            <p className="font-mono text-2xl font-bold text-ink">RM {fmt(currentMonthExpenses)}</p>
          </div>
          {momDiff !== null ? (
            <p className={`text-sm font-medium ${momDiff < 0 ? 'text-income' : 'text-expense'}`}>
              {momDiff < 0 ? '↓' : '↑'} You spent {Math.abs(momDiff)}%{' '}
              {momDiff < 0 ? 'less' : 'more'} than last month
            </p>
          ) : (
            <p className="text-sm text-muted">No comparison data available</p>
          )}
          <div className="mt-2 pt-2 border-t border-border">
            <p className="text-xs text-muted">
              This month income:{' '}
              <span className="font-mono font-semibold text-income">
                RM {fmt(currentMonthIncome)}
              </span>
            </p>
          </div>
        </div>

        {/* Card 4 — Biggest Single Expense */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <p className="text-[10px] font-semibold text-faint uppercase tracking-wider mb-3">
            Biggest Expense This Month
          </p>
          {biggestExpense ? (
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: biggestCategoryStyle.bg }}
              >
                <BiggestIcon className="w-5 h-5" style={{ color: biggestCategoryStyle.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink truncate">{biggestExpense.description}</p>
                <p className="text-xs text-faint mt-0.5">{biggestExpense.category}</p>
                <p className="font-mono text-base font-bold text-expense mt-0.5">
                  -RM {fmt(biggestExpense.amount)}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted">No expenses this month</p>
          )}
        </div>
      </div>
    </div>
  )
}
