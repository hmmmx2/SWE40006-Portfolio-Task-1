import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { autoUpdater } from 'electron-updater'
import icon from '../../resources/icon.png?asset'

type UpdatePreference = 'auto' | 'notify' | 'manual'

interface UpdateStatus {
  type: 'checking' | 'available' | 'up-to-date' | 'downloading' | 'downloaded' | 'error'
  message: string
}

let mainWindow: BrowserWindow | null = null
let updatePreference: UpdatePreference = 'notify'

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

  // ── Renderer sends preference on mount; main adjusts behavior accordingly ──
  ipcMain.on('init-updater', (_event, pref: UpdatePreference) => {
    if (!app.isPackaged) return
    updatePreference = pref
    autoUpdater.autoDownload = pref === 'auto'
    if (pref !== 'manual') {
      autoUpdater.checkForUpdates()
    }
  })

  // ── User changed preference in Settings ────────────────────────────────────
  ipcMain.on('set-update-preference', (_event, pref: UpdatePreference) => {
    updatePreference = pref
    autoUpdater.autoDownload = pref === 'auto'
  })

  // ── User clicked "Update Now" in notify dialog ─────────────────────────────
  ipcMain.on('update-download-now', () => {
    autoUpdater.downloadUpdate()
  })

  // ── User clicked "Install Now" after download complete ─────────────────────
  ipcMain.on('install-update-now', () => {
    autoUpdater.quitAndInstall(false, true)
  })

  // ── User clicked "Check for Updates" manually in Settings ─────────────────
  ipcMain.on('check-for-updates', () => {
    if (app.isPackaged) {
      autoUpdater.checkForUpdates()
    }
  })

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
  if (updatePreference === 'auto') {
    // Silent mode — just show progress banner, no dialog
    sendUpdateStatus({
      type: 'available',
      message: `Update v${info.version} found. Downloading silently...`,
    })
  } else {
    // Notify mode — send prompt so renderer shows UpdateDialog
    mainWindow?.webContents.send('update-prompt', {
      version: info.version,
      releaseNotes: typeof info.releaseNotes === 'string' ? info.releaseNotes : '',
    })
  }
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
  if (updatePreference === 'auto') {
    // Silent mode — auto-install after 3 seconds
    sendUpdateStatus({
      type: 'downloaded',
      message: 'Update downloaded. Restarting in 3 seconds...',
    })
    setTimeout(() => autoUpdater.quitAndInstall(false, true), 3000)
  } else {
    // Notify mode — user clicked "Update Now", install is ready
    sendUpdateStatus({ type: 'downloaded', message: 'Update ready. Restarting...' })
    setTimeout(() => autoUpdater.quitAndInstall(false, true), 2000)
  }
})

autoUpdater.on('error', (err: Error) => {
  sendUpdateStatus({ type: 'error', message: `Update error: ${err.message}` })
})
