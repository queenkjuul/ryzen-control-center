import { ipcMain, nativeTheme } from 'electron'
import { logger } from '/@/main/config/logger'
import { getRyzenInfo, setParamAndGetInfo } from '/@/main/ryzenadj'
import { appState } from '/@/main/state'
import type { AppSettings, AppSettingsKey } from '/@/types/app-settings'
import { IpcResponse } from '/@/types/ipc'
import type {
  RyzenInfo,
  RyzenInfoParams,
  RyzenInfoValue,
  RyzenSetResultAndNewInfo
} from '/@/types/ryzenadj/ryzenadj'

export function setupIpcServer() {
  return new Promise<void>((res, _rej) => {
    nativeTheme.addListener('updated', () => {
      logger.info('Settings changed, informing client')
      appState.setSetting('highContrast', nativeTheme.shouldUseHighContrastColors)
      if (appState.appSettings.themeSource === 'system') {
        appState.setSetting('dark', nativeTheme.shouldUseDarkColors)
      }
      appState.mainWindow.webContents.send('settingsChange', appState.appSettings)
    })

    ipcMain.handle(
      'setSetting',
      async <K extends AppSettingsKey>(_event, setting: K, value: AppSettings[K]) => {
        logger.info(`Client requested set ${setting} to ${value}`)
        return new IpcResponse<AppSettings>(appState.setSetting(setting, value))
      }
    )

    ipcMain.handle('getSettings', async (): Promise<IpcResponse<AppSettings>> => {
      logger.info('Client requested current settings state', appState.appSettings)
      return new IpcResponse<AppSettings>(appState.appSettings)
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

    // TODO: Error handling?
    res()
  })
}
