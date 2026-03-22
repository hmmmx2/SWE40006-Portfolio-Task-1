import { useState, useEffect, useCallback, useRef } from 'react'
import { Transaction, sampleTransactions } from './data/sampleData'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'
import JustUpdatedToast from './components/JustUpdatedToast'
import UpdateProgressToast from './components/UpdateProgressToast'
import UpdateDialog from './components/UpdateDialog'

export type ActiveView = 'dashboard' | 'transactions' | 'add' | 'insights' | 'settings'
export type FilterType = 'all' | 'income' | 'expense'
export type UpdatePreference = 'auto' | 'notify' | 'manual'

export interface UpdateStatus {
  type: 'checking' | 'available' | 'up-to-date' | 'downloading' | 'downloaded' | 'error'
  message: string
  percent?: number
  version?: string
}

// Update types that represent an active update in progress
const ACTIVE_UPDATE_TYPES = new Set(['available', 'downloading', 'downloaded'])

const PREF_KEY = 'fintrack-update-preference'

declare const __APP_VERSION__: string

export default function App(): React.JSX.Element {
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions)
  const [activeView, setActiveView] = useState<ActiveView>('dashboard')
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus | null>(null)
  const [updateToastVisible, setUpdateToastVisible] = useState(false)
  const [showJustUpdatedToast, setShowJustUpdatedToast] = useState(false)
  const [updatedVersion, setUpdatedVersion] = useState<string>('')

  // Update preference (persisted in localStorage)
  const [updatePreference, setUpdatePreference] = useState<UpdatePreference>(
    () => (localStorage.getItem(PREF_KEY) as UpdatePreference) ?? 'auto',
  )

  // Notify-mode dialog
  const [updatePrompt, setUpdatePrompt] = useState<{
    version: string
    releaseNotes: string
  } | null>(null)
  const skippedVersionRef = useRef<string>('')

  // Ref so IPC callback always sees latest status without stale closure
  const updateStatusRef = useRef<UpdateStatus | null>(null)

  // ── Detect just-updated on first launch after update ──────────────
  useEffect(() => {
    const STORAGE_KEY = 'fintrack-last-version'
    const currentVersion = __APP_VERSION__
    const lastVersion = localStorage.getItem(STORAGE_KEY)
    if (lastVersion !== null && lastVersion !== currentVersion) {
      setUpdatedVersion(currentVersion)
      setShowJustUpdatedToast(true)
    }
    localStorage.setItem(STORAGE_KEY, currentVersion)
  }, [])

  // ── Send saved preference to main on startup ───────────────────────
  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.initUpdater(updatePreference)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-updater IPC listener ──────────────────────────────────────
  useEffect(() => {
    if (!window.electronAPI) return

    window.electronAPI.onUpdateStatus((data: UpdateStatus) => {
      const current = updateStatusRef.current

      // If we are already in an active update flow, ignore silent
      // background noise (checking / up-to-date) so the toast never
      // disappears on its own while a download is in progress.
      if (
        current &&
        ACTIVE_UPDATE_TYPES.has(current.type) &&
        (data.type === 'checking' || data.type === 'up-to-date')
      ) {
        return
      }

      updateStatusRef.current = data
      setUpdateStatus(data)

      if (ACTIVE_UPDATE_TYPES.has(data.type)) {
        // Show toast and keep it visible — never auto-hide during update
        setUpdateToastVisible(true)
      } else if (data.type === 'checking' || data.type === 'up-to-date') {
        // Silently fade after 4 s — only if no active update running
        setTimeout(() => {
          if (
            updateStatusRef.current?.type === 'checking' ||
            updateStatusRef.current?.type === 'up-to-date'
          ) {
            setUpdateStatus(null)
            updateStatusRef.current = null
          }
        }, 4000)
      }
    })

    // Notify mode: show the update dialog
    window.electronAPI.onUpdatePrompt((data) => {
      if (skippedVersionRef.current === data.version) return
      setUpdatePrompt(data)
    })

    return () => {
      if (window.electronAPI) window.electronAPI.removeUpdateListener()
    }
  }, [])

  // Hide toast UI — download keeps going silently in background.
  // When download finishes (downloaded event), toast reappears automatically.
  const handleUpdateToastClose = useCallback(() => {
    setUpdateToastVisible(false)
  }, [])

  const dismissJustUpdatedToast = useCallback(() => setShowJustUpdatedToast(false), [])

  // ── Update preference ──────────────────────────────────────────────
  const handleUpdatePreferenceChange = useCallback((pref: UpdatePreference) => {
    setUpdatePreference(pref)
    localStorage.setItem(PREF_KEY, pref)
    if (window.electronAPI) window.electronAPI.setUpdatePreference(pref)
  }, [])

  // ── Notify-mode dialog actions ─────────────────────────────────────
  const handleUpdateNow = useCallback(() => {
    setUpdatePrompt(null)
    if (window.electronAPI) window.electronAPI.downloadUpdate()
  }, [])

  const handleRemindLater = useCallback(() => {
    setUpdatePrompt(null)
  }, [])

  const handleSkipVersion = useCallback(() => {
    if (updatePrompt) skippedVersionRef.current = updatePrompt.version
    setUpdatePrompt(null)
  }, [updatePrompt])

  // ── Transactions ───────────────────────────────────────────────────
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

  // Show the update toast only when visible flag is true AND status is active
  const showUpdateProgressToast =
    updateToastVisible &&
    updateStatus !== null &&
    ACTIVE_UPDATE_TYPES.has(updateStatus.type)

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
          updatePreference={updatePreference}
          onUpdatePreferenceChange={handleUpdatePreferenceChange}
        />
      </div>

      {/* Update progress toast — persists until user closes or restarts */}
      {showUpdateProgressToast && updateStatus && (
        <UpdateProgressToast
          status={updateStatus}
          onClose={handleUpdateToastClose}
        />
      )}

      {/* Just-updated toast — appears once after update */}
      {showJustUpdatedToast && updatedVersion && (
        <JustUpdatedToast version={updatedVersion} onDismiss={dismissJustUpdatedToast} />
      )}

      {/* Notify-mode update dialog */}
      {updatePrompt && (
        <UpdateDialog
          version={updatePrompt.version}
          onUpdateNow={handleUpdateNow}
          onRemindLater={handleRemindLater}
          onSkipVersion={handleSkipVersion}
        />
      )}
    </div>
  )
}
