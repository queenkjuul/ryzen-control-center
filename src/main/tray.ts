import { app, Menu, Tray } from 'electron'
import { APP_NAME } from '/@/main/config/app-name'
import { logger } from '/@/main/config/logger'
import { setRyzenParam } from '/@/main/ryzenadj'
import { appState } from '/@/main/state'
import { getIconPath } from '/@/main/util/icon'

export function createTray(): Tray {
  logger.info('Setting up tray icon')
  const tray = new Tray(getIconPath())
  const trayMenu = Menu.buildFromTemplate([
    {
      label: 'Open Ryzen Control Center',
      type: 'normal',
      click: () => appState.mainWindow.show()
    },
    { type: 'separator' },
    {
      label: 'Set High Performance Mode',
      type: 'normal',
      click: () => setRyzenParam('max-performance', null)
    },
    {
      label: 'Set Power Saving Mode',
      type: 'normal',
      click: () => setRyzenParam('power-saving', null)
    },
    { type: 'separator' },
    {
      label: 'Exit',
      type: 'normal',
      click: () => {
        logger.debug('Exit tray button clicked')
        appState.forceQuit = true
        app.quit()
      }
    }
  ])
  tray.setContextMenu(trayMenu)
  tray.setTitle(APP_NAME)
  tray.setToolTip(APP_NAME)
  tray.on('click', () => appState.mainWindow.show())
  return tray
}
