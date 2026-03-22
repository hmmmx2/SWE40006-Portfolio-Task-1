import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { autoUpdater } from 'electron-updater'
import icon from '../../resources/icon.png?asset'

interface UpdateStatus {
  type: 'checking' | 'available' | 'up-to-date' | 'downloading' | 'downloaded' | 'error'
  message: string
  percent?: number
  version?: string
}

let mainWindow: BrowserWindow | null = null

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

  // ── User clicks "Restart Now" in the UpdateBanner ─────────────────
  ipcMain.on('restart-and-install', () => {
    autoUpdater.quitAndInstall(false, true)
  })

  createWindow()

  // ── Silent auto-updater: delay 4s so app fully renders first ─────────────
  if (app.isPackaged) {
    autoUpdater.autoDownload = true
    setTimeout(() => {
      autoUpdater.checkForUpdates()
    }, 4000)
  }

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
  sendUpdateStatus({
    type: 'available',
    message: `FinTrack v${info.version} is available. Downloading...`,
    version: info.version,
  })
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
