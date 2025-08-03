import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, ipcMain, Menu, nativeTheme, shell, Tray } from 'electron'
import { join } from 'path'
import { IpcResponse } from '../types/ipc'
import { APP_NAME } from './app-name'
import { getIconPath } from './icon'
import { logger } from './logger'
import { getRyzenInfo, setParamAndGetInfo } from './ryzenadj'
import { sillySaying } from './util/silly'
import { ubuntuSetup, ubuntuTeardown } from './util/ubuntu'
import { version } from '/@/version.js'
import {
  RyzenInfo,
  RyzenInfoParams,
  RyzenInfoValue,
  RyzenSetResultAndNewInfo
} from '/@types/ryzenadj'

function silly(): void {
  logger.silly(sillySaying())
}

console.log(`
${APP_NAME}
Version ${version}
(C) 2025 Queen K Juul
Distributed under the terms of the GNU GPL v3 License, except where noted
=========================================================================

`)

silly()

let tray: Tray
let mainWindow: BrowserWindow
let forceQuit = false

function createWindow(): void {
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

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('close', (event) => {
    logger.debug('mainWindow close', event)
    if (mainWindow.isVisible() && !forceQuit) {
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // INIT
  // =================================
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // gather system information - sudo-prompt won't work right on Ubuntu 25+ without a workaround.
  // I've raised an issue with the polkit team as this problem affects all node processes,
  // not just VSCode:
  //
  // https://github.com/polkit-org/polkit/issues/572
  //
  // workaround comes from here:
  //
  // https://github.com/microsoft/vscode/issues/237427#issuecomment-2582881451
  logger.info('Gathering system information')
  if (process.platform === 'linux') {
    ubuntuSetup()
  }

  // TRAY
  // ================================
  logger.info('Setting up tray icon')
  tray = new Tray(getIconPath())
  const trayMenu = Menu.buildFromTemplate([
    { label: 'Ryzen Control Center', type: 'normal', click: createWindow },
    { type: 'separator' },
    {
      label: 'Exit',
      type: 'normal',
      click: () => {
        logger.debug('Exit tray button clicked')
        forceQuit = true
        app.quit()
      }
    }
  ])
  tray.setContextMenu(trayMenu)
  tray.setTitle(APP_NAME)
  tray.setToolTip(APP_NAME)
  tray.on('click', createWindow)

  // APP
  // =========================================
  logger.info('Setting up app event listners')
  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  app.on('will-quit', () => {
    logger.debug('Preparing to quit')
    ubuntuTeardown()
    silly()
    logger.silly('Done.')
    logger.silly('Have a nice day!')
  })

  // IPC
  // =================================================
  logger.info('Setting up IPC listeners and handlers')

  ipcMain.on('ping', () => {
    nativeTheme.themeSource = nativeTheme.shouldUseDarkColors ? 'light' : 'dark'
    tray.setImage(getIconPath())
    mainWindow.setIcon(getIconPath())
  })

  ipcMain.handle('getRyzenInfo', async (): Promise<IpcResponse<RyzenInfo>> => {
    logger.info('Client requested RyzenInfo')
    try {
      const data = await getRyzenInfo()
      logger.debug('ryzenadj -i parsed output \n', data)
      return { data }
    } catch (error) {
      logger.error(error)
      return { error }
    }
  })

  ipcMain.handle(
    'setRyzenParam',
    async (
      event,
      param: RyzenInfoParams,
      value: RyzenInfoValue | null
    ): Promise<IpcResponse<RyzenSetResultAndNewInfo>> => {
      logger.info(`Client requested set ${param} to ${value}`)
      logger.debug('setRyzenParam Event: \n', event)
      try {
        const data = await setParamAndGetInfo(param, value)
        return { data }
      } catch (error) {
        logger.error(error)
        return { error }
      }
    }
  )

  logger.info('Main process initialized')
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
