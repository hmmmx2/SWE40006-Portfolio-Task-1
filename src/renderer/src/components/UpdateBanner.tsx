import { CheckCircle, AlertCircle, Download, Loader2, RefreshCw, RotateCcw } from 'lucide-react'
import { motion } from 'framer-motion'
import type { UpdateStatus } from '../App'

interface UpdateBannerProps {
  status: UpdateStatus
}

export default function UpdateBanner({ status }: UpdateBannerProps): React.JSX.Element {
  const handleRestart = (): void => {
    if (window.electronAPI?.restartAndInstall) {
      window.electronAPI.restartAndInstall()
    }
  }

  // ── Downloaded — prominent bar with restart button ─────────────────
  if (status.type === 'downloaded') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex-shrink-0 bg-income-bg border-b-2 border-income px-6 py-3 flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-income flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-income">
              {status.version
                ? `FinTrack v${status.version} ready to install`
                : 'Update ready to install'}
            </p>
            <p className="text-xs text-income/70">Restart FinTrack to apply the update</p>
          </div>
        </div>
        <button
          onClick={handleRestart}
          className="flex items-center gap-2 bg-income text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-income/90 transition-colors flex-shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Restart Now
        </button>
      </motion.div>
    )
  }

  // ── Downloading — slim bar with animated progress bar ─────────────
  if (status.type === 'downloading') {
    const percent = status.percent ?? 0
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex-shrink-0 bg-income-bg border-b border-border px-6 py-2.5"
      >
        <div className="flex items-center justify-between gap-4 mb-1.5">
          <div className="flex items-center gap-2">
            <Download className="w-3.5 h-3.5 text-income animate-bounce" />
            <span className="text-xs font-medium text-income">
              Downloading update in background...
            </span>
          </div>
          <span className="text-xs font-mono font-semibold text-income">{percent}%</span>
        </div>
        <div className="h-1 w-full bg-income/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-income rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </motion.div>
    )
  }

  // ── Available — slim bar ───────────────────────────────────────────
  if (status.type === 'available') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="h-9 px-6 flex items-center gap-2 text-xs font-medium border-b border-border flex-shrink-0 bg-income-bg text-income"
      >
        <Download className="w-3.5 h-3.5" />
        <span>{status.message}</span>
      </motion.div>
    )
  }

  // ── All other states — slim bar ────────────────────────────────────
  const config = {
    checking: {
      bg: 'bg-hover',
      text: 'text-muted',
      icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />,
    },
    'up-to-date': {
      bg: 'bg-hover',
      text: 'text-muted',
      icon: <CheckCircle className="w-3.5 h-3.5" />,
    },
    error: {
      bg: 'bg-expense-bg',
      text: 'text-expense',
      icon: <AlertCircle className="w-3.5 h-3.5" />,
    },
  }

  const fallback = {
    bg: 'bg-hover',
    text: 'text-muted',
    icon: <RefreshCw className="w-3.5 h-3.5" />,
  }
  const { bg, text, icon } = config[status.type as keyof typeof config] ?? fallback

  return (
    <div
      className={`h-9 px-6 flex items-center gap-2 text-xs font-medium border-b border-border flex-shrink-0 ${bg} ${text}`}
    >
      {icon}
      <span>{status.message}</span>
    </div>
  )
}
