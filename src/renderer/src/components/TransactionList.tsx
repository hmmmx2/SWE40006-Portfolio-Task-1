import { Inbox } from 'lucide-react'
import { Transaction, ALL_CATEGORIES } from '../data/sampleData'
import type { FilterType } from '../App'
import TransactionItem from './TransactionItem'

interface TransactionListProps {
  transactions: Transaction[]
  filterType: FilterType
  setFilterType: (f: FilterType) => void
  filterCategory: string
  setFilterCategory: (c: string) => void
  deleteTransaction: (id: string) => void
}

export default function TransactionList({
  transactions,
  filterType,
  setFilterType,
  filterCategory,
  setFilterCategory,
  deleteTransaction,
}: TransactionListProps): React.JSX.Element {
  const filtered = transactions.filter((t) => {
    const typeMatch = filterType === 'all' || t.type === filterType
    const catMatch = filterCategory === 'all' || t.category === filterCategory
    return typeMatch && catMatch
  })

  const typeButtons: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Income', value: 'income' },
    { label: 'Expenses', value: 'expense' },
  ]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-ink">Transactions</h1>
        <p className="text-sm text-muted mt-0.5">
          {filtered.length} of {transactions.length} transactions
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-border">
        {/* Filter bar */}
        <div className="flex items-center gap-2 p-4 border-b border-border flex-wrap">
          <div className="flex gap-1">
            {typeButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => setFilterType(btn.value)}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  filterType === btn.value
                    ? 'bg-ink text-white'
                    : 'bg-hover text-muted hover:text-ink'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="ml-auto bg-hover border border-border text-sm text-ink rounded-lg px-3 py-1.5 focus:outline-none focus:border-ink/30"
          >
            <option value="all">All Categories</option>
            {ALL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* List */}
        <div className="px-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted">
              <Inbox className="w-10 h-10 text-faint" />
              <p className="text-sm">No transactions match your filters</p>
            </div>
          ) : (
            filtered.map((t, i) => (
              <TransactionItem
                key={t.id}
                transaction={t}
                onDelete={deleteTransaction}
                index={i}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
