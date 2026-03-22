import { useEffect } from 'react'
import { CheckCircle, X, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface JustUpdatedToastProps {
  version: string
  onDismiss: () => void
}

export default function JustUpdatedToast({
  version,
  onDismiss,
}: JustUpdatedToastProps): React.JSX.Element {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 7000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  const versionMessages: Record<string, string[]> = {
    '1.1.0': [
      'Spending Insights Panel added',
      'Savings rate ring and top category',
      'Month-over-month comparison',
    ],
  }

  const bullets = versionMessages[version] ?? ['New features and improvements']

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed bottom-5 right-5 z-50 w-80 bg-white border border-border rounded-2xl shadow-lg overflow-hidden"
      >
        {/* Green top accent bar */}
        <div className="h-1 w-full bg-income" />

        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-income-bg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-income" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted uppercase tracking-wide">
                  Successfully Updated
                </p>
                <p className="text-sm font-bold text-ink">FinTrack v{version}</p>
              </div>
            </div>
            <button
              onClick={onDismiss}
              className="text-faint hover:text-muted transition-colors mt-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* What's new */}
          <div className="bg-hover rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3 h-3 text-income" />
              <p className="text-[10px] font-semibold text-muted uppercase tracking-wide">
                What&apos;s New
              </p>
            </div>
            <ul className="space-y-1">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-ink">
                  <span className="text-income font-bold mt-0.5">✦</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Auto-dismiss bar */}
          <motion.div
            className="mt-3 h-0.5 bg-income rounded-full origin-left"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 7, ease: 'linear' }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
