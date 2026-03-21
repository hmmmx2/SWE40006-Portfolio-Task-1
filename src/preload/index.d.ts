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
}

declare global {
  interface Window {
    electron: ElectronAPI
    electronAPI: {
      onUpdateStatus: (callback: (data: UpdateStatus) => void) => void
      removeUpdateListener: () => void
    }
  }
}
