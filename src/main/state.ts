import { BrowserWindow, nativeTheme, Tray } from 'electron'
import settings from 'electron-settings'
import { logger } from '/@/main/config/logger'
import { getIconPath } from '/@/main/util/icon'
import {
  appSettingsKeys,
  type AppSettings,
  type AppSettingsClass,
  type AppSettingsKey,
  type AppSettingsValue,
  type ThemeSource
} from '/@/types/app-settings'
import { darkThemes, getDefaultTheme } from '/@/types/themes'

export class AppState {
  public forceQuit = false

  private _initialized: boolean = false

  // @ts-ignore gets defined in initialize()
  private _appSettings: AppSettings
  // @ts-ignore gets defined in initialize()
  private _mainWindow: BrowserWindow
  // @ts-ignore gets defined in initialize()
  private _tray: Tray

  private settingsCallbacks: Partial<Record<AppSettingsKey, (...args: any) => void>> = {
    themeSource: (themeSource: ThemeSource) => {
      nativeTheme.themeSource = themeSource
      this.setSetting(
        'dark',
        this._appSettings.useCustomTheme
          ? darkThemes.includes(this.appSettings.theme)
          : nativeTheme.shouldUseDarkColors
      )
      this.setSetting('highContrast', nativeTheme.shouldUseHighContrastColors)
    },
    useCustomTheme: (useCustomTheme: boolean) => {
      if (useCustomTheme) {
        this.setSetting('dark', darkThemes.includes(this._appSettings.theme))
      }
    },
    dark: (dark: boolean) => {
      const icon = getIconPath(
        dark,
        this.appSettings.highContrast || this.appSettings.forceHighContrast
      )
      this.mainWindow.setIcon(icon)
      this.tray.setImage(icon)
    }
  }

  public async initialize(): Promise<AppState> {
    logger.info('Loading saved settings')
    const storedSettings: Partial<typeof AppSettingsClass> = {}
    appSettingsKeys
      .filter((setting) => settings.hasSync(setting))
      .forEach((setting) => {
        storedSettings[setting] = settings.getSync(setting) as AppSettingsValue
        logger.debug(`Setting ${setting} to saved value ${storedSettings[setting]}`)
      })

    logger.debug('Checking stored settings values')
    // DEFAULT SETTINGS VALUES
    for (const setting of appSettingsKeys) {
      if (storedSettings[setting] === undefined) {
        let value
        switch (setting) {
          case 'dark':
            value = nativeTheme.shouldUseDarkColors
            break
          case 'highContrast':
            value = nativeTheme.shouldUseHighContrastColors
            break
          case 'forceHighContrast':
            value = false
            break
          case 'useCustomTheme':
            value = false
            break
          case 'theme':
            value = getDefaultTheme(
              nativeTheme.shouldUseDarkColors,
              nativeTheme.shouldUseHighContrastColors
            )
            break
        }
        logger.debug(`Setting default value for ${setting}: ${value}`)
        storedSettings[setting] = value
      }
    }
    // we should be guaranteed to have a full AppSettings object now
    this._appSettings = storedSettings as AppSettings

    // instantiate windows
    const { createMainWindow } = await import('/@/main/window')
    this._mainWindow = await createMainWindow()
    this._mainWindow.on('close', (event) => {
      logger.info('Closing main window')
      if (this._mainWindow?.isVisible() && !this.forceQuit) {
        event.preventDefault()
        this._mainWindow.hide()
      }
    })

    // set up tray icon
    const { createTray } = await import('/@/main/tray')
    this._tray = createTray()

    this._initialized = true
    logger.debug('App state initialized: ', this)
    return this
  }

  get initialized(): boolean {
    return this._initialized
  }

  get mainWindow(): BrowserWindow {
    if (!this._initialized) {
      throw new Error('Cannot access mainWindow before initialization!')
    }
    return this._mainWindow as BrowserWindow
  }

  get appSettings(): AppSettings {
    if (!this._initialized) {
      throw new Error('Cannot access appSettings before initialization!')
    }
    return this._appSettings as AppSettings
  }

  get tray(): Tray {
    if (!this._initialized) {
      throw new Error('Cannot access appSettings before initialization!')
    }
    return this._tray
  }

  getSetting(setting: AppSettingsKey): AppSettingsValue {
    return this.appSettings[setting]
  }

  setSetting<K extends keyof AppSettings>(setting: K, value: AppSettings[K]): AppSettings {
    settings.setSync(setting, value)
    this._appSettings[setting] = value
    if (this.settingsCallbacks[setting]) {
      this.settingsCallbacks[setting](this.appSettings[setting])
    }
    return this._appSettings
  }
}

export const appState = new AppState()
