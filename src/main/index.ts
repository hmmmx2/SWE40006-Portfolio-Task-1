import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { autoUpdater } from 'electron-updater'
import icon from '../../resources/icon.png?asset'

type UpdatePreference = 'auto' | 'notify' | 'manual'

interface UpdateStatus {
  type: 'checking' | 'available' | 'up-to-date' | 'downloading' | 'downloaded' | 'error'
  message: string
  percent?: number
  version?: string
}

let mainWindow: BrowserWindow | null = null
let currentPref: UpdatePreference = 'auto'

function sendUpdateStatus(status: UpdateStatus): void {
  if (mainWindow) {
    mainWindow.webContents.send('update-status', status)
  }
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: '#f5f5f4',
    title: 'FinTrack',
    ...(process.platform === 'linux' ? { icon } : { icon }),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow!.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.fintrack.app')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  // ── Restart and install update ─────────────────────────────────────
  ipcMain.on('restart-and-install', () => {
    autoUpdater.quitAndInstall(true, true)
  })

  // ── Same handler wired via install-update-now (notify mode) ────────
  ipcMain.on('install-update-now', () => {
    autoUpdater.quitAndInstall(true, true)
  })

  // ── Renderer sends saved preference on startup ─────────────────────
  ipcMain.on('init-updater', (_event, pref: UpdatePreference) => {
    currentPref = pref
    if (!app.isPackaged) return
    autoUpdater.autoDownload = pref === 'auto'
    if (pref !== 'manual') {
      setTimeout(() => {
        autoUpdater.checkForUpdates()
      }, 4000)
    }
  })

  // ── User changes preference in Settings ────────────────────────────
  ipcMain.on('set-update-preference', (_event, pref: UpdatePreference) => {
    currentPref = pref
    autoUpdater.autoDownload = pref === 'auto'
  })

  // ── Manual check from Settings panel ──────────────────────────────
  ipcMain.on('check-for-updates', () => {
    if (!app.isPackaged) return
    autoUpdater.checkForUpdates()
  })

  // ── Notify mode: user clicked "Update Now" in dialog ──────────────
  ipcMain.on('update-download-now', () => {
    autoUpdater.downloadUpdate()
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// ── Auto-updater events ──────────────────────────────────────────────────────

autoUpdater.on('checking-for-update', () => {
  sendUpdateStatus({ type: 'checking', message: 'Checking for updates...' })
})

autoUpdater.on('update-available', (info) => {
  if (currentPref === 'notify') {
    // Show a dialog — user decides whether to download
    if (mainWindow) {
      mainWindow.webContents.send('update-prompt', {
        version: info.version,
        releaseNotes: info.releaseNotes ?? '',
      })
    }
  } else {
    // auto: show toast, autoDownload will kick in automatically
    sendUpdateStatus({
      type: 'available',
      message: `FinTrack v${info.version} is available. Downloading...`,
      version: info.version,
    })
  }
})

autoUpdater.on('update-not-available', () => {
  sendUpdateStatus({ type: 'up-to-date', message: 'FinTrack is up to date.' })
})

autoUpdater.on('download-progress', (progress) => {
  sendUpdateStatus({
    type: 'downloading',
    message: `Downloading update...`,
    percent: Math.round(progress.percent),
  })
})

autoUpdater.on('update-downloaded', (info) => {
  // Do NOT auto-restart — let user click "Restart Now"
  sendUpdateStatus({
    type: 'downloaded',
    message: 'Update ready to install.',
    version: info.version,
  })
})

autoUpdater.on('error', (err: Error) => {
  sendUpdateStatus({ type: 'error', message: `Update error: ${err.message}` })
})
