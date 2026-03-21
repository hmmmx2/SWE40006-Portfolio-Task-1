import { motion } from 'framer-motion'
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
  Trash2,
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import type { Transaction, Category } from '../data/sampleData'
import type { LucideIcon } from 'lucide-react'

interface CategoryStyle {
  icon: LucideIcon
  bg: string
  color: string
}

const CATEGORY_STYLES: Record<Category, CategoryStyle> = {
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

interface TransactionItemProps {
  transaction: Transaction
  onDelete?: (id: string) => void
  index?: number
}

const fmt = (n: number): string =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function TransactionItem({
  transaction,
  onDelete,
  index = 0,
}: TransactionItemProps): React.JSX.Element {
  const style = CATEGORY_STYLES[transaction.category]
  const Icon = style.icon

  const formattedDate = (() => {
    try {
      return format(parseISO(transaction.date), 'MMM d, yyyy')
    } catch {
      return transaction.date
    }
  })()

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, delay: index * 0.03 }}
      className="flex items-center gap-3 py-3 border-b border-border last:border-0 group"
    >
      {/* Category icon */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: style.bg }}
      >
        <Icon className="w-4 h-4" style={{ color: style.color }} />
      </div>

      {/* Description */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink truncate">{transaction.description}</p>
        <p className="text-xs text-faint mt-0.5">
          {transaction.category} · {formattedDate}
        </p>
      </div>

      {/* Amount + delete */}
      <div className="flex items-center gap-2">
        <span
          className={`font-mono text-sm font-semibold ${
            transaction.type === 'income' ? 'text-income' : 'text-expense'
          }`}
        >
          {transaction.type === 'income' ? '+' : '-'}RM {fmt(transaction.amount)}
        </span>
        {onDelete && (
          <button
            onClick={() => onDelete(transaction.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-expense-bg text-faint hover:text-expense"
            title="Delete transaction"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  )
}
