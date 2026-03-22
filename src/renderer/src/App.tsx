import { useState, useEffect } from 'react'
import { Transaction, sampleTransactions } from './data/sampleData'
import Sidebar from './components/Sidebar'
import UpdateBanner from './components/UpdateBanner'
import UpdateDialog from './components/UpdateDialog'
import MainContent from './components/MainContent'

export type ActiveView = 'dashboard' | 'transactions' | 'add' | 'insights' | 'settings'
export type FilterType = 'all' | 'income' | 'expense'
export type UpdatePreference = 'auto' | 'notify' | 'manual'

const UPDATE_PREF_KEY = 'fintrack-update-preference'

export interface UpdateStatus {
  type: 'checking' | 'available' | 'up-to-date' | 'downloading' | 'downloaded' | 'error'
  message: string
}

const SKIP_KEY = 'fintrack-skipped-version'

export default function App(): React.JSX.Element {
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions)
  const [activeView, setActiveView] = useState<ActiveView>('dashboard')
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus | null>(null)
  const [updatePrompt, setUpdatePrompt] = useState<{ version: string } | null>(null)
  const [updatePreference, setUpdatePreferenceState] = useState<UpdatePreference>(
    () => (localStorage.getItem(UPDATE_PREF_KEY) as UpdatePreference) ?? 'notify'
  )

  const handleUpdatePreferenceChange = (pref: UpdatePreference): void => {
    setUpdatePreferenceState(pref)
    localStorage.setItem(UPDATE_PREF_KEY, pref)
    if (window.electronAPI) window.electronAPI.setUpdatePreference(pref)
  }

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.initUpdater(updatePreference)
      window.electronAPI.onUpdateStatus((data: UpdateStatus) => {
        setUpdateStatus(data)
        if (data.type === 'up-to-date' || data.type === 'checking') {
          setTimeout(() => setUpdateStatus(null), 5000)
        }
      })
      window.electronAPI.onUpdatePrompt((data) => {
        const skipped = localStorage.getItem(SKIP_KEY)
        if (skipped === data.version) return
        setUpdatePrompt({ version: data.version })
      })
    }
    return () => {
      if (window.electronAPI) window.electronAPI.removeUpdateListener()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleUpdateNow = (): void => {
    setUpdatePrompt(null)
    window.electronAPI.downloadUpdate()
    setUpdateStatus({ type: 'downloading', message: 'Downloading update...' })
  }

  const handleRemindLater = (): void => {
    setUpdatePrompt(null)
  }

  const handleSkipVersion = (): void => {
    if (updatePrompt) {
      localStorage.setItem(SKIP_KEY, updatePrompt.version)
    }
    setUpdatePrompt(null)
  }

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

        {/* Custom update dialog — shows when update is available */}
        {updatePrompt && (
          <UpdateDialog
            version={updatePrompt.version}
            onUpdateNow={handleUpdateNow}
            onRemindLater={handleRemindLater}
            onSkipVersion={handleSkipVersion}
          />
        )}

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
          updatePreference={updatePreference}
          onUpdatePreferenceChange={handleUpdatePreferenceChange}
        />
      </div>
    </div>
  )
}
