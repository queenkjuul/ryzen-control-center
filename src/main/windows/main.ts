import { is } from '@electron-toolkit/utils'
import { BrowserWindow, shell } from 'electron'
import { join } from 'path'
import { APP_NAME } from '/@/main/config/app-name'
import { logger } from '/@/main/config/logger'
import { appState } from '/@/main/state'
import { getIconPath } from '/@/main/util/icon'

let { mainWindow } = appState
const { forceQuit } = appState

export function createWindow(): void {
  if (mainWindow) {
    logger.info('Showing main window')
    mainWindow.show()
    return
  }

  logger.info('Creating main window')
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon: getIconPath() } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true
    },
    title: APP_NAME
  })
    .on('ready-to-show', () => {
      mainWindow?.show()
    })
    .on('close', (event) => {
      logger.debug('mainWindow close', event)
      if (mainWindow?.isVisible() && !forceQuit) {
        event.preventDefault()
        mainWindow.hide()
      }
    })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    logger.info('Opening external window')
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}
