import { useState } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Dot,
} from 'recharts'
import type { TooltipProps, DotProps } from 'recharts'
import { format, subMonths, startOfMonth, parseISO, isSameMonth } from 'date-fns'
import { BarChart2, TrendingUp } from 'lucide-react'
import { Transaction } from '../data/sampleData'

interface BalanceChartProps {
  transactions: Transaction[]
}

interface ChartDataPoint {
  month: string
  income: number
  expenses: number
}

type ChartMode = 'bar' | 'line'

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>): React.JSX.Element | null {
  if (!active || !payload || payload.length === 0) return null
  const income = payload.find((p) => p.dataKey === 'income')?.value ?? 0
  const expenses = payload.find((p) => p.dataKey === 'expenses')?.value ?? 0
  return (
    <div className="bg-white border border-border rounded-xl p-3 text-xs shadow-sm min-w-[148px]">
      <p className="font-semibold text-ink mb-2">{label}</p>
      <div className="flex items-center gap-1.5 mb-1">
        <span className="w-2.5 h-2.5 rounded-sm inline-block flex-shrink-0" style={{ background: '#16a34a' }} />
        <span className="text-muted">Income</span>
        <span className="ml-auto font-mono font-semibold text-income">
          RM {income.toLocaleString()}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-sm inline-block flex-shrink-0" style={{ background: '#ef4444' }} />
        <span className="text-muted">Expenses</span>
        <span className="ml-auto font-mono font-semibold text-expense">
          RM {expenses.toLocaleString()}
        </span>
      </div>
    </div>
  )
}

// Custom dot for the line chart — only render when the value > 0
function ActiveDot(props: DotProps & { value?: number; color: string }): React.JSX.Element | null {
  const { cx, cy, value, color } = props
  if (!value || value === 0 || cx === undefined || cy === undefined) return null
  return <Dot cx={cx} cy={cy} r={4} fill={color} stroke="white" strokeWidth={2} />
}

export default function BalanceChart({ transactions }: BalanceChartProps): React.JSX.Element {
  const [mode, setMode] = useState<ChartMode>('bar')

  const referenceDate =
    transactions.length > 0
      ? parseISO(transactions.reduce((a, b) => (a.date > b.date ? a : b)).date)
      : new Date()

  const months = Array.from({ length: 6 }, (_, i) => subMonths(referenceDate, 5 - i))

  const data: ChartDataPoint[] = months.map((month) => {
    const label = format(month, 'MMM')
    const monthStart = startOfMonth(month)

    const income = transactions
      .filter((t) => t.type === 'income' && isSameMonth(parseISO(t.date), monthStart))
      .reduce((s, t) => s + t.amount, 0)

    const expenses = transactions
      .filter((t) => t.type === 'expense' && isSameMonth(parseISO(t.date), monthStart))
      .reduce((s, t) => s + t.amount, 0)

    return { month: label, income, expenses }
  })

  const maxVal = Math.max(...data.flatMap((d) => [d.income, d.expenses]), 1)

  const sharedAxisProps = {
    xAxis: (
      <XAxis
        dataKey="month"
        tick={{ fontSize: 11, fill: '#9ca3af' }}
        axisLine={false}
        tickLine={false}
      />
    ),
    yAxis: (
      <YAxis
        tick={{ fontSize: 11, fill: '#9ca3af' }}
        axisLine={false}
        tickLine={false}
        domain={[0, Math.ceil(maxVal / 1000) * 1000]}
        tickFormatter={(v: number) =>
          v === 0 ? 'RM0' : `RM${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
        }
        width={40}
      />
    ),
    grid: <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />,
    tooltip: <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />,
    legend: (
      <Legend
        wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
        iconType="square"
        iconSize={8}
        formatter={(value) => <span style={{ color: '#6b7280' }}>{value}</span>}
      />
    ),
  }

  return (
    <div>
      {/* Toggle buttons */}
      <div className="flex items-center gap-1 mb-3 w-fit">
        <button
          onClick={() => setMode('bar')}
          title="Bar chart"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            mode === 'bar'
              ? 'bg-ink text-white'
              : 'bg-hover text-muted hover:text-ink'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          Bar
        </button>
        <button
          onClick={() => setMode('line')}
          title="Line chart"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            mode === 'line'
              ? 'bg-ink text-white'
              : 'bg-hover text-muted hover:text-ink'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Line
        </button>
      </div>

      <ResponsiveContainer width="100%" height={155}>
        {mode === 'bar' ? (
          <BarChart data={data} barCategoryGap="28%" barGap={3}>
            {sharedAxisProps.grid}
            {sharedAxisProps.xAxis}
            {sharedAxisProps.yAxis}
            {sharedAxisProps.tooltip}
            {sharedAxisProps.legend}
            <Bar dataKey="income" name="Income" fill="#16a34a" radius={[4, 4, 0, 0]} maxBarSize={32} />
            <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={32} />
          </BarChart>
        ) : (
          <LineChart data={data}>
            {sharedAxisProps.grid}
            {sharedAxisProps.xAxis}
            {sharedAxisProps.yAxis}
            {sharedAxisProps.tooltip}
            {sharedAxisProps.legend}
            <Line
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#16a34a"
              strokeWidth={2.5}
              dot={<ActiveDot color="#16a34a" />}
              activeDot={{ r: 5, fill: '#16a34a', stroke: 'white', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="#ef4444"
              strokeWidth={2.5}
              strokeDasharray="5 3"
              dot={<ActiveDot color="#ef4444" />}
              activeDot={{ r: 5, fill: '#ef4444', stroke: 'white', strokeWidth: 2 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}
