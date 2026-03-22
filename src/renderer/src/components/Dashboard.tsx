import { parseISO, startOfMonth, isSameMonth, subMonths } from 'date-fns'
import { Transaction } from '../data/sampleData'
import type { ActiveView } from '../App'
import TransactionItem from './TransactionItem'
import BalanceChart from './BalanceChart'
import SpendingPie from './SpendingPie'

interface DashboardProps {
  transactions: Transaction[]
  setActiveView: (view: ActiveView) => void
  deleteTransaction: (id: string) => void
}

const fmt = (n: number): string =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function monthOverMonth(
  transactions: Transaction[],
  type: 'income' | 'expense',
): { pct: number; direction: 'up' | 'down' | 'same' } {
  const mostRecent =
    transactions.length > 0
      ? transactions.reduce((a, b) => (a.date > b.date ? a : b)).date
      : new Date().toISOString().split('T')[0]

  const current = startOfMonth(parseISO(mostRecent))
  const prev = subMonths(current, 1)

  const sumForMonth = (month: Date): number =>
    transactions
      .filter((t) => t.type === type && isSameMonth(parseISO(t.date), month))
      .reduce((s, t) => s + t.amount, 0)

  const cur = sumForMonth(current)
  const pre = sumForMonth(prev)

  if (pre === 0) return { pct: 0, direction: 'same' }
  const pct = Math.round(((cur - pre) / pre) * 100)
  return { pct: Math.abs(pct), direction: pct > 0 ? 'up' : pct < 0 ? 'down' : 'same' }
}

export default function Dashboard({
  transactions,
  setActiveView,
  deleteTransaction,
}: DashboardProps): React.JSX.Element {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0)

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0)

  const balance = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0

  const incomeMoM = monthOverMonth(transactions, 'income')
  const expenseMoM = monthOverMonth(transactions, 'expense')

  const recent = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)

  return (
    <div className="p-6 flex flex-col gap-5">
      {/* Greeting */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-ink">{getGreeting()}</h1>
          <p className="text-sm text-muted mt-0.5">Here is your financial overview</p>
        </div>
        <span className="text-[10px] text-faint font-mono bg-hover border border-border px-2.5 py-1 rounded-full">
          v{__APP_VERSION__}
        </span>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3.5">
        <div className="bg-white rounded-2xl border border-border border-l-2 border-l-ink p-4">
          <p className="text-[10px] font-semibold text-faint uppercase tracking-wider mb-1.5">
            Net Balance
          </p>
          <p className="font-mono text-2xl font-semibold text-ink">RM {fmt(balance)}</p>
          <p className="text-xs text-muted mt-1">
            Savings rate{' '}
            <span className="text-income font-semibold">{savingsRate}%</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-border border-l-2 border-l-income p-4">
          <p className="text-[10px] font-semibold text-faint uppercase tracking-wider mb-1.5">
            Total Income
          </p>
          <p className="font-mono text-2xl font-semibold text-income">RM {fmt(totalIncome)}</p>
          <p className="text-xs text-muted mt-1">
            {incomeMoM.direction === 'same' ? (
              'No change from last month'
            ) : (
              <>
                <span
                  className={
                    incomeMoM.direction === 'up' ? 'text-income font-semibold' : 'text-expense font-semibold'
                  }
                >
                  {incomeMoM.direction === 'up' ? '↑' : '↓'} {incomeMoM.pct}%
                </span>{' '}
                from last month
              </>
            )}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-border border-l-2 border-l-expense p-4">
          <p className="text-[10px] font-semibold text-faint uppercase tracking-wider mb-1.5">
            Total Expenses
          </p>
          <p className="font-mono text-2xl font-semibold text-expense">RM {fmt(totalExpenses)}</p>
          <p className="text-xs text-muted mt-1">
            {expenseMoM.direction === 'same' ? (
              'No change from last month'
            ) : (
              <>
                <span
                  className={
                    expenseMoM.direction === 'up' ? 'text-expense font-semibold' : 'text-income font-semibold'
                  }
                >
                  {expenseMoM.direction === 'up' ? '↑' : '↓'} {expenseMoM.pct}%
                </span>{' '}
                from last month
              </>
            )}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-3.5">
        <div className="bg-white rounded-2xl border border-border p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold text-ink">Monthly Overview</h2>
            <span className="text-xs text-faint">6 months</span>
          </div>
          <BalanceChart transactions={transactions} />
        </div>

        <div className="bg-white rounded-2xl border border-border p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold text-ink">Spending by Category</h2>
            <span className="text-xs text-faint">All time</span>
          </div>
          <SpendingPie transactions={transactions} />
        </div>
      </div>

      {/* Recent transactions */}
      <div className="bg-white rounded-2xl border border-border p-5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-semibold text-ink">Recent Transactions</h2>
          <button
            onClick={() => setActiveView('transactions')}
            className="text-xs text-muted hover:text-ink font-medium transition-colors"
          >
            See all →
          </button>
        </div>
        <div>
          {recent.map((t, i) => (
            <TransactionItem key={t.id} transaction={t} onDelete={deleteTransaction} index={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
