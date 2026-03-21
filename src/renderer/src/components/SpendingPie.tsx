import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import type { TooltipProps } from 'recharts'
import { Transaction } from '../data/sampleData'

interface SpendingPieProps {
  transactions: Transaction[]
}

interface PieDataPoint {
  name: string
  value: number
}

// Visually distinct, accessible color palette for each spending category
const CATEGORY_COLORS: Record<string, string> = {
  Housing: '#2563eb',       // blue-600
  Food: '#16a34a',          // green-600
  Shopping: '#f59e0b',      // amber-500
  Transport: '#8b5cf6',     // violet-500
  Entertainment: '#ec4899', // pink-500
  Healthcare: '#ef4444',    // red-500
  Education: '#06b6d4',     // cyan-500
  Other: '#94a3b8',         // slate-400
}

// Fallback colors for any unlisted categories
const FALLBACK_COLORS = [
  '#3b82f6', '#10b981', '#f97316', '#a855f7',
  '#14b8a6', '#f43f5e', '#84cc16', '#64748b',
]

function CustomTooltip({
  active,
  payload,
}: TooltipProps<number, string>): React.JSX.Element | null {
  if (!active || !payload || payload.length === 0) return null
  const item = payload[0]
  return (
    <div className="bg-white border border-border rounded-xl p-3 text-xs shadow-sm">
      <div className="flex items-center gap-1.5 mb-1">
        <span
          className="w-2 h-2 rounded-full inline-block flex-shrink-0"
          style={{ background: item.payload?.fill }}
        />
        <p className="font-semibold text-ink">{item.name}</p>
      </div>
      <p className="text-muted font-mono">
        RM {(item.value ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </p>
    </div>
  )
}

export default function SpendingPie({ transactions }: SpendingPieProps): React.JSX.Element {
  const expenseMap = new Map<string, number>()

  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      expenseMap.set(t.category, (expenseMap.get(t.category) ?? 0) + t.amount)
    })

  const data: PieDataPoint[] = Array.from(expenseMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([name, value]) => ({ name, value }))

  if (data.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-sm text-muted">
        No expense data yet
      </div>
    )
  }

  const total = data.reduce((s, d) => s + d.value, 0)

  const getColor = (name: string, index: number): string =>
    CATEGORY_COLORS[name] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length]

  return (
    <div className="flex items-center gap-5">
      {/* Donut chart */}
      <div className="flex-shrink-0">
        <ResponsiveContainer width={110} height={110}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={32}
              outerRadius={50}
              paddingAngle={2}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={getColor(entry.name, index)}
                  stroke="white"
                  strokeWidth={1.5}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        {data.map((entry, index) => {
          const color = getColor(entry.name, index)
          const pct = total > 0 ? Math.round((entry.value / total) * 100) : 0
          return (
            <div key={entry.name} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs text-ink truncate">{entry.name}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="font-mono text-xs text-muted">
                  RM {entry.value >= 1000
                    ? `${(entry.value / 1000).toFixed(1)}k`
                    : entry.value.toLocaleString()}
                </span>
                <span
                  className="text-[10px] font-semibold w-8 text-right"
                  style={{ color }}
                >
                  {pct}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
