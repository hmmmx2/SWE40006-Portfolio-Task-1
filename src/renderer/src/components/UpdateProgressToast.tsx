import { Download, CheckCircle, AlertCircle, RotateCcw, X, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { UpdateStatus } from '../App'

interface UpdateProgressToastProps {
  status: UpdateStatus
  onDismiss: () => void
}

export default function UpdateProgressToast({
  status,
  onDismiss,
}: UpdateProgressToastProps): React.JSX.Element | null {
  // Don't show for checking / up-to-date — those are silent
  if (status.type === 'checking' || status.type === 'up-to-date') return null

  const handleRestart = (): void => {
    if (window.electronAPI?.restartAndInstall) {
      window.electronAPI.restartAndInstall()
    }
  }

  const percent = status.percent ?? 0

  return (
    <AnimatePresence>
      <motion.div
        key="update-progress-toast"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="fixed bottom-5 right-5 z-50 w-80 bg-white border border-border rounded-2xl shadow-lg overflow-hidden"
      >
        {/* Top accent bar — green always */}
        <div
          className={`h-1 w-full ${status.type === 'error' ? 'bg-expense' : 'bg-income'}`}
        />

        <div className="p-4">
          {/* ── Header ─────────────────────────────────────── */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5">
              {/* Icon */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  status.type === 'error'
                    ? 'bg-expense-bg'
                    : status.type === 'downloaded'
                      ? 'bg-income-bg'
                      : 'bg-income-bg'
                }`}
              >
                {status.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-expense" />
                ) : status.type === 'downloaded' ? (
                  <CheckCircle className="w-4 h-4 text-income" />
                ) : (
                  <Download className="w-4 h-4 text-income" />
                )}
              </div>

              {/* Title + subtitle */}
              <div>
                <p className="text-[10px] font-semibold text-muted uppercase tracking-wide">
                  {status.type === 'available' && 'Update Available'}
                  {status.type === 'downloading' && 'Downloading Update'}
                  {status.type === 'downloaded' && 'Update Ready'}
                  {status.type === 'error' && 'Update Error'}
                </p>
                <p className="text-sm font-bold text-ink">
                  {status.version
                    ? `FinTrack v${status.version}`
                    : 'FinTrack'}
                </p>
              </div>
            </div>

            {/* Dismiss — only for error or downloaded */}
            {(status.type === 'error' || status.type === 'downloaded') && (
              <button
                onClick={onDismiss}
                className="text-faint hover:text-muted transition-colors mt-0.5 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* ── Body by state ──────────────────────────────── */}

          {/* Available — just text */}
          {status.type === 'available' && (
            <div className="flex items-center gap-2 text-xs text-muted">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-income flex-shrink-0" />
              <span>A new version is available. Starting download...</span>
            </div>
          )}

          {/* Downloading — progress bar */}
          {status.type === 'downloading' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted">Downloading in background...</span>
                <span className="text-xs font-mono font-semibold text-income">{percent}%</span>
              </div>
              {/* Track */}
              <div className="h-2 w-full bg-income/15 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-income rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
              <p className="text-[10px] text-faint mt-1.5">
                You can keep using FinTrack while it downloads
              </p>
            </div>
          )}

          {/* Downloaded — restart button */}
          {status.type === 'downloaded' && (
            <div>
              {/* Full progress bar */}
              <div className="h-2 w-full bg-income/15 rounded-full overflow-hidden mb-3">
                <div className="h-full w-full bg-income rounded-full" />
              </div>
              <p className="text-xs text-muted mb-3">
                The update has been downloaded. Restart FinTrack to apply it.
              </p>
              <button
                onClick={handleRestart}
                className="w-full flex items-center justify-center gap-2 bg-ink text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-ink/90 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Restart Now
              </button>
            </div>
          )}

          {/* Error */}
          {status.type === 'error' && (
            <p className="text-xs text-expense">{status.message}</p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
