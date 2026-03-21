import { RefreshCw, CheckCircle, AlertCircle, Download, Loader2 } from 'lucide-react'
import type { UpdateStatus } from '../App'

interface UpdateBannerProps {
  status: UpdateStatus
}

export default function UpdateBanner({ status }: UpdateBannerProps): React.JSX.Element {
  const config = {
    checking: {
      bg: 'bg-hover',
      text: 'text-muted',
      icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />,
    },
    available: {
      bg: 'bg-income-bg',
      text: 'text-income',
      icon: <Download className="w-3.5 h-3.5" />,
    },
    'up-to-date': {
      bg: 'bg-hover',
      text: 'text-muted',
      icon: <CheckCircle className="w-3.5 h-3.5" />,
    },
    downloading: {
      bg: 'bg-income-bg',
      text: 'text-income',
      icon: <Download className="w-3.5 h-3.5" />,
    },
    downloaded: {
      bg: 'bg-income-bg',
      text: 'text-income font-semibold',
      icon: <CheckCircle className="w-3.5 h-3.5" />,
    },
    error: {
      bg: 'bg-expense-bg',
      text: 'text-expense',
      icon: <AlertCircle className="w-3.5 h-3.5" />,
    },
  }

  const { bg, text, icon } = config[status.type] ?? {
    bg: 'bg-hover',
    text: 'text-muted',
    icon: <RefreshCw className="w-3.5 h-3.5" />,
  }

  return (
    <div
      className={`h-9 px-6 flex items-center gap-2 text-xs font-medium border-b border-border flex-shrink-0 ${bg} ${text}`}
    >
      {icon}
      <span>{status.message}</span>
    </div>
  )
}
