import { useState } from 'react'
import { Download, Bell, Hand, RefreshCw, CheckCircle2 } from 'lucide-react'
import type { UpdatePreference } from '../../../preload/index.d'

interface SettingsPanelProps {
  updatePreference: UpdatePreference
  onUpdatePreferenceChange: (pref: UpdatePreference) => void
}

interface OptionConfig {
  value: UpdatePreference
  label: string
  description: string
  icon: React.ReactNode
  badge?: string
}

const options: OptionConfig[] = [
  {
    value: 'auto',
    label: 'Auto Update',
    description: 'Silently download and install updates in the background. No prompts.',
    icon: <Download className="w-4 h-4" />,
    badge: 'Recommended',
  },
  {
    value: 'notify',
    label: 'Notify Me',
    description: 'Show a dialog when an update is available. You choose when to install.',
    icon: <Bell className="w-4 h-4" />,
  },
  {
    value: 'manual',
    label: 'Manual',
    description: 'Never check for updates automatically. Use the button below to check.',
    icon: <Hand className="w-4 h-4" />,
  },
]

export default function SettingsPanel({
  updatePreference,
  onUpdatePreferenceChange,
}: SettingsPanelProps): React.JSX.Element {
  const [checkStatus, setCheckStatus] = useState<string | null>(null)

  const handleManualCheck = (): void => {
    setCheckStatus('checking')
    window.electronAPI.checkForUpdates()
    setTimeout(() => setCheckStatus(null), 4000)
  }

  return (
    <div className="flex-1 overflow-y-auto bg-app p-6">
      <div className="max-w-lg mx-auto flex flex-col gap-6">

        {/* Page heading */}
        <div>
          <h1 className="text-xl font-semibold text-ink">Settings</h1>
          <p className="text-sm text-muted mt-1">Manage your FinTrack preferences.</p>
        </div>

        {/* Update preference card */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-ink">Auto-Update Preference</h2>
            <p className="text-xs text-muted mt-0.5">
              Choose how FinTrack handles new versions.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {options.map((opt) => {
              const isSelected = updatePreference === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => onUpdatePreferenceChange(opt.value)}
                  className={`w-full flex items-start gap-3 p-3.5 rounded-xl border text-left transition-colors ${
                    isSelected
                      ? 'border-ink bg-ink/[0.03]'
                      : 'border-border hover:border-muted/40 hover:bg-hover'
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isSelected ? 'bg-ink text-white' : 'bg-hover text-muted'
                    }`}
                  >
                    {opt.icon}
                  </div>

                  {/* Label + description */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-semibold ${isSelected ? 'text-ink' : 'text-muted'}`}
                      >
                        {opt.label}
                      </span>
                      {opt.badge && (
                        <span className="text-[10px] font-semibold bg-income-bg text-income px-1.5 py-0.5 rounded-full">
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted mt-0.5 leading-relaxed">{opt.description}</p>
                  </div>

                  {/* Selected indicator */}
                  <div className="flex-shrink-0 mt-0.5">
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-ink" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-border" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Manual check card */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <h2 className="text-sm font-semibold text-ink mb-1">Check for Updates</h2>
          <p className="text-xs text-muted mb-4">
            Manually check GitHub Releases for a newer version of FinTrack.
          </p>
          <button
            onClick={handleManualCheck}
            disabled={checkStatus === 'checking'}
            className="flex items-center gap-2 bg-ink text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-ink/90 transition-colors disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${checkStatus === 'checking' ? 'animate-spin' : ''}`} />
            {checkStatus === 'checking' ? 'Checking...' : 'Check Now'}
          </button>
        </div>

        {/* App info card */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <h2 className="text-sm font-semibold text-ink mb-3">About FinTrack</h2>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Version', value: `v${__APP_VERSION__}` },
              { label: 'Platform', value: 'Windows' },
              { label: 'Repository', value: 'hmmmx2/SWE40006-Portfolio-Task-1' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-xs text-muted">{label}</span>
                <span className="text-xs font-mono font-semibold text-ink">{value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
