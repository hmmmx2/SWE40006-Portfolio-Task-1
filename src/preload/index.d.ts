import { ElectronAPI } from '@electron-toolkit/preload'

export type UpdateStatusType =
  | 'checking'
  | 'available'
  | 'up-to-date'
  | 'downloading'
  | 'downloaded'
  | 'error'

export interface UpdateStatus {
  type: UpdateStatusType
  message: string
  percent?: number
  version?: string
}

export interface UpdatePrompt {
  version: string
  releaseNotes: string
}

export type UpdatePreference = 'auto' | 'notify' | 'manual'

declare global {
  interface Window {
    electron: ElectronAPI
    electronAPI: {
      onUpdateStatus: (callback: (data: UpdateStatus) => void) => void
      removeUpdateListener: () => void
      onUpdatePrompt: (callback: (data: UpdatePrompt) => void) => void
      downloadUpdate: () => void
      installUpdateNow: () => void
      initUpdater: (pref: UpdatePreference) => void
      setUpdatePreference: (pref: UpdatePreference) => void
      checkForUpdates: () => void
      restartAndInstall: () => void
    }
  }
}
