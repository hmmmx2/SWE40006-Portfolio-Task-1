import { useState, useEffect } from 'react'
import { Transaction, sampleTransactions } from './data/sampleData'
import Sidebar from './components/Sidebar'
import UpdateBanner from './components/UpdateBanner'
import MainContent from './components/MainContent'

export type ActiveView = 'dashboard' | 'transactions' | 'add' | 'insights'
export type FilterType = 'all' | 'income' | 'expense'

export interface UpdateStatus {
  type: 'checking' | 'available' | 'up-to-date' | 'downloading' | 'downloaded' | 'error'
  message: string
}

export default function App(): React.JSX.Element {
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions)
  const [activeView, setActiveView] = useState<ActiveView>('dashboard')
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus | null>(null)

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.onUpdateStatus((data: UpdateStatus) => {
        setUpdateStatus(data)
        if (data.type === 'up-to-date' || data.type === 'checking') {
          setTimeout(() => setUpdateStatus(null), 5000)
        }
      })
    }
    return () => {
      if (window.electronAPI) window.electronAPI.removeUpdateListener()
    }
  }, [])

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>): void => {
    const newTxn: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setTransactions((prev) => [newTxn, ...prev])
    setActiveView('dashboard')
  }

  const deleteTransaction = (id: string): void => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  return (
    <div className="flex h-screen bg-app text-ink overflow-hidden">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        balance={balance}
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        transactionCount={transactions.length}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        {updateStatus && <UpdateBanner status={updateStatus} />}
        <MainContent
          activeView={activeView}
          setActiveView={setActiveView}
          transactions={transactions}
          filterType={filterType}
          setFilterType={setFilterType}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          addTransaction={addTransaction}
          deleteTransaction={deleteTransaction}
        />
      </div>
    </div>
  )
}
