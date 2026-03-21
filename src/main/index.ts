import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { autoUpdater } from 'electron-updater'
import icon from '../../resources/icon.png?asset'

interface UpdateStatus {
  type: 'checking' | 'available' | 'up-to-date' | 'downloading' | 'downloaded' | 'error'
  message: string
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

  createWindow()

  // Auto-updater only runs in packaged app — disabled in dev mode
  if (app.isPackaged) {
    autoUpdater.checkForUpdatesAndNotify()
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
    message: `Update available: v${info.version}. Downloading...`,
  })
})

autoUpdater.on('update-not-available', () => {
  sendUpdateStatus({ type: 'up-to-date', message: 'FinTrack is up to date.' })
})

autoUpdater.on('download-progress', (progress) => {
  sendUpdateStatus({
    type: 'downloading',
    message: `Downloading update: ${Math.round(progress.percent)}%`,
  })
})

autoUpdater.on('update-downloaded', () => {
  sendUpdateStatus({
    type: 'downloaded',
    message: 'Update downloaded. Restarting in 3 seconds...',
  })
  setTimeout(() => autoUpdater.quitAndInstall(), 3000)
})

autoUpdater.on('error', (err: Error) => {
  sendUpdateStatus({ type: 'error', message: `Update error: ${err.message}` })
})
