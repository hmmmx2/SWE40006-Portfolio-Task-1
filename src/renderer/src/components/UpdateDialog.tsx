import { motion, AnimatePresence } from 'framer-motion'
import { Download, Clock, SkipForward, Sparkles, X } from 'lucide-react'

interface UpdateDialogProps {
  version: string
  onUpdateNow: () => void
  onRemindLater: () => void
  onSkipVersion: () => void
}

export default function UpdateDialog({
  version,
  onUpdateNow,
  onRemindLater,
  onSkipVersion,
}: UpdateDialogProps): React.JSX.Element {
  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Blur overlay */}
        <div className="absolute inset-0 bg-ink/20 backdrop-blur-sm" />

        {/* Dialog card */}
        <motion.div
          className="relative z-10 bg-white rounded-2xl border border-border shadow-xl w-full max-w-sm mx-4 overflow-hidden"
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {/* Header strip */}
          <div className="bg-income-bg border-b border-border px-6 pt-5 pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-income rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-income uppercase tracking-wide">
                    Update Available
                  </p>
                  <h2 className="text-lg font-bold text-ink leading-tight">
                    FinTrack v{version}
                  </h2>
                </div>
              </div>
              <button
                onClick={onRemindLater}
                className="text-faint hover:text-muted transition-colors mt-0.5"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-4">
            <p className="text-sm text-muted leading-relaxed">
              A new version of FinTrack is ready to install. Update now to get the latest features
              and improvements.
            </p>

            {/* What's new pill */}
            <div className="mt-3 bg-hover rounded-xl px-3 py-2.5 border border-border">
              <p className="text-[11px] font-semibold text-faint uppercase tracking-wide mb-1">
                What&apos;s new
              </p>
              <p className="text-xs text-ink font-medium">
                ✦ Spending Insights Panel — savings rate, top category, month-over-month
                comparison
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 pb-5 flex flex-col gap-2">
            {/* Update Now — primary */}
            <button
              onClick={onUpdateNow}
              className="w-full flex items-center justify-center gap-2 bg-ink text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-ink/90 transition-colors"
            >
              <Download className="w-4 h-4" />
              Update Now
            </button>

            {/* Remind Me Later — secondary */}
            <button
              onClick={onRemindLater}
              className="w-full flex items-center justify-center gap-2 bg-hover text-muted rounded-xl py-2.5 text-sm font-medium hover:text-ink hover:bg-border transition-colors border border-border"
            >
              <Clock className="w-4 h-4" />
              Remind Me Later
            </button>

            {/* Skip This Version — ghost */}
            <button
              onClick={onSkipVersion}
              className="w-full flex items-center justify-center gap-2 text-faint rounded-xl py-2 text-xs font-medium hover:text-muted transition-colors"
            >
              <SkipForward className="w-3.5 h-3.5" />
              Skip This Version
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
