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
  percent?: number
  version?: string
}

export interface UpdatePrompt {
  version: string
  releaseNotes: string
}

export type UpdatePreference = 'auto' | 'notify' | 'manual'

const fintrackAPI = {
  onUpdateStatus: (callback: (data: UpdateStatus) => void): void => {
    ipcRenderer.on('update-status', (_event, data: UpdateStatus) => callback(data))
  },
  removeUpdateListener: (): void => {
    ipcRenderer.removeAllListeners('update-status')
    ipcRenderer.removeAllListeners('update-prompt')
  },
  onUpdatePrompt: (callback: (data: UpdatePrompt) => void): void => {
    ipcRenderer.on('update-prompt', (_event, data: UpdatePrompt) => callback(data))
  },
  downloadUpdate: (): void => {
    ipcRenderer.send('update-download-now')
  },
  installUpdateNow: (): void => {
    ipcRenderer.send('install-update-now')
  },
  initUpdater: (pref: UpdatePreference): void => {
    ipcRenderer.send('init-updater', pref)
  },
  setUpdatePreference: (pref: UpdatePreference): void => {
    ipcRenderer.send('set-update-preference', pref)
  },
  checkForUpdates: (): void => {
    ipcRenderer.send('check-for-updates')
  },
  restartAndInstall: (): void => {
    ipcRenderer.send('restart-and-install')
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
