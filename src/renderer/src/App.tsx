import { useState, useEffect, useCallback } from 'react'
import { Transaction, sampleTransactions } from './data/sampleData'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'
import JustUpdatedToast from './components/JustUpdatedToast'
import UpdateProgressToast from './components/UpdateProgressToast'

export type ActiveView = 'dashboard' | 'transactions' | 'add'
export type FilterType = 'all' | 'income' | 'expense'

export interface UpdateStatus {
  type: 'checking' | 'available' | 'up-to-date' | 'downloading' | 'downloaded' | 'error'
  message: string
  percent?: number
  version?: string
}

declare const __APP_VERSION__: string

export default function App(): React.JSX.Element {
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions)
  const [activeView, setActiveView] = useState<ActiveView>('dashboard')
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus | null>(null)
  const [showUpdateToast, setShowUpdateToast] = useState(false)
  const [updatedVersion, setUpdatedVersion] = useState<string>('')

  // ── Detect just-updated on first launch after update ──────────────
  useEffect(() => {
    const STORAGE_KEY = 'fintrack-last-version'
    const currentVersion = __APP_VERSION__
    const lastVersion = localStorage.getItem(STORAGE_KEY)

    if (lastVersion !== null && lastVersion !== currentVersion) {
      setUpdatedVersion(currentVersion)
      setShowUpdateToast(true)
    }

    localStorage.setItem(STORAGE_KEY, currentVersion)
  }, [])

  // ── Auto-updater IPC listener ──────────────────────────────────────
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

  const dismissToast = useCallback(() => setShowUpdateToast(false), [])

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

      {/* Update progress toast — bottom right, shown during download lifecycle */}
      {updateStatus &&
        updateStatus.type !== 'checking' &&
        updateStatus.type !== 'up-to-date' && (
          <UpdateProgressToast
            status={updateStatus}
            onDismiss={() => setUpdateStatus(null)}
          />
        )}

      {/* Just-updated toast — bottom right, appears once after update */}
      {showUpdateToast && updatedVersion && (
        <JustUpdatedToast version={updatedVersion} onDismiss={dismissToast} />
      )}
    </div>
  )
}
