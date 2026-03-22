import { Download, CheckCircle, AlertCircle, RotateCcw, X, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import type { UpdateStatus } from '../App'

interface UpdateProgressToastProps {
  status: UpdateStatus
  onClose: () => void  // hides UI only — download continues in background
}

export default function UpdateProgressToast({
  status,
  onClose,
}: UpdateProgressToastProps): React.JSX.Element {
  const handleRestart = (): void => {
    if (window.electronAPI?.restartAndInstall) {
      window.electronAPI.restartAndInstall()
    }
  }

  const percent = status.percent ?? 0

  const headerLabel = {
    available: 'Update Available',
    downloading: 'Downloading Update',
    downloaded: 'Update Ready',
    error: 'Update Error',
  }[status.type] ?? 'Update'

  const isDownloaded = status.type === 'downloaded'
  const isError = status.type === 'error'

  return (
    <motion.div
      key="update-progress-toast"
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="fixed bottom-5 right-5 z-50 w-80 bg-white border border-border rounded-2xl shadow-lg overflow-hidden"
    >
      {/* Coloured accent bar at top */}
      <div className={`h-1 w-full ${isError ? 'bg-expense' : 'bg-income'}`} />

      <div className="p-4">
        {/* ── Header row — always has close button ────────────────── */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isError ? 'bg-expense-bg' : 'bg-income-bg'
              }`}
            >
              {isError ? (
                <AlertCircle className="w-4 h-4 text-expense" />
              ) : isDownloaded ? (
                <CheckCircle className="w-4 h-4 text-income" />
              ) : (
                <Download className="w-4 h-4 text-income" />
              )}
            </div>
            <div>
              <p className="text-[10px] font-semibold text-muted uppercase tracking-wide">
                {headerLabel}
              </p>
              <p className="text-sm font-bold text-ink">
                {status.version ? `FinTrack v${status.version}` : 'FinTrack'}
              </p>
            </div>
          </div>

          {/* Close button — ALWAYS visible, only hides UI, download continues */}
          <button
            onClick={onClose}
            title="Hide — update continues in background"
            className="w-6 h-6 flex items-center justify-center rounded-md text-faint hover:text-muted hover:bg-hover transition-colors flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ── Body ─────────────────────────────────────────────────── */}

        {/* Available */}
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

        {/* Downloaded — full bar + restart button */}
        {status.type === 'downloaded' && (
          <div>
            <div className="h-2 w-full bg-income/15 rounded-full overflow-hidden mb-3">
              <div className="h-full w-full bg-income rounded-full" />
            </div>
            <p className="text-xs text-muted mb-3">
              Download complete. Restart to apply the update now.
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
  )
}
