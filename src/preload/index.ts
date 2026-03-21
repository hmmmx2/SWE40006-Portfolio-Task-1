import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

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

const fintrackAPI = {
  onUpdateStatus: (callback: (data: UpdateStatus) => void): void => {
    ipcRenderer.on('update-status', (_event, data: UpdateStatus) => callback(data))
  },
  removeUpdateListener: (): void => {
    ipcRenderer.removeAllListeners('update-status')
  },
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('electronAPI', fintrackAPI)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.electronAPI = fintrackAPI
}
