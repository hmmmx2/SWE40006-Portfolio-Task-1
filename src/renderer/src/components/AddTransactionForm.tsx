import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Transaction, INCOME_CATEGORIES, EXPENSE_CATEGORIES, TransactionType } from '../data/sampleData'
import type { Category } from '../data/sampleData'

interface AddTransactionFormProps {
  addTransaction: (t: Omit<Transaction, 'id' | 'createdAt'>) => void
  onCancel: () => void
}

export default function AddTransactionForm({
  addTransaction,
  onCancel,
}: AddTransactionFormProps): React.JSX.Element {
  const [type, setType] = useState<TransactionType>('expense')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<Category>('Food')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  const handleTypeChange = (newType: TransactionType): void => {
    setType(newType)
    setCategory(newType === 'income' ? 'Salary' : 'Food')
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Enter a valid amount greater than 0'
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (!date) {
      newErrors.date = 'Date is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    if (!validate()) return
    addTransaction({
      type,
      amount: parseFloat(amount),
      description: description.trim(),
      category,
      date,
    })
  }

  return (
    <div className="p-6">
      <button
        onClick={onCancel}
        className="flex items-center gap-1.5 text-sm text-muted hover:text-ink mb-5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="bg-white rounded-2xl border border-border p-6 max-w-md">
        <h1 className="text-lg font-semibold text-ink mb-6">Add Transaction</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Type toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                type === 'income'
                  ? 'bg-income text-white'
                  : 'bg-hover text-muted hover:bg-border'
              }`}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                type === 'expense'
                  ? 'bg-expense text-white'
                  : 'bg-hover text-muted hover:bg-border'
              }`}
            >
              Expense
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted font-mono text-xs font-semibold">
                RM
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-hover border border-border rounded-xl text-sm text-ink placeholder-faint pl-11 pr-4 py-2.5 w-full focus:outline-none focus:border-ink/30 font-mono"
              />
            </div>
            {errors.amount && <p className="text-xs text-expense mt-1">{errors.amount}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">
              Description
            </label>
            <input
              type="text"
              placeholder="What was this for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-hover border border-border rounded-xl text-sm text-ink placeholder-faint px-4 py-2.5 w-full focus:outline-none focus:border-ink/30"
            />
            {errors.description && (
              <p className="text-xs text-expense mt-1">{errors.description}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="bg-hover border border-border rounded-xl text-sm text-ink px-4 py-2.5 w-full focus:outline-none focus:border-ink/30"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-hover border border-border rounded-xl text-sm text-ink px-4 py-2.5 w-full focus:outline-none focus:border-ink/30"
            />
            {errors.date && <p className="text-xs text-expense mt-1">{errors.date}</p>}
          </div>

          <button
            type="submit"
            className="bg-ink text-white rounded-xl font-semibold py-3 w-full hover:bg-ink/90 transition-colors mt-1 text-sm"
          >
            Add Transaction
          </button>
        </form>
      </div>
    </div>
  )
}
