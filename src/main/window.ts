import { is } from '@electron-toolkit/utils'
import { BrowserWindow, shell, type BrowserWindowConstructorOptions } from 'electron'
import { join } from 'path'
import { logger } from '/@/main/config/logger'
import { getIconPath } from '/@/main/util/icon'

const mainWindowConfig: BrowserWindowConstructorOptions = {
  width: 900,
  height: 670,
  show: false,
  autoHideMenuBar: true,
  ...(process.platform === 'linux' ? { icon: getIconPath() } : {}),
  webPreferences: {
    preload: join(__dirname, '../preload/preload.js'),
    sandbox: true // no default API exposed
  }
}

export function createMainWindow(): Promise<BrowserWindow> {
  return new Promise((res, _rej) => {
    logger.info('Creating main window')
    const mainWindow = new BrowserWindow(mainWindowConfig)
    mainWindow
      .on('show', () => {
        logger.info('Showing main window')
      })
      .on('hide', () => {
        logger.info('Hiding main window')
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
      mainWindow.removeMenu()
      mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }

    mainWindow.on('ready-to-show', () => {
      res(mainWindow)
    })
  })
}
