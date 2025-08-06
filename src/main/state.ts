import { BrowserWindow, nativeTheme } from 'electron'
import settings from 'electron-settings'
import { logger } from '/@/main/config/logger'
import { createMainWindow } from '/@/main/window'
import { Themes, type Theme } from '/@/types/themes'

export type OptionalWindow = BrowserWindow | null

function getDefaultTheme(dark: boolean, highContrast: boolean): Theme {
  return dark
    ? highContrast
      ? Themes['amd-dark-hic']
      : Themes['amd-dark']
    : highContrast
      ? Themes['amd-light-hic']
      : Themes['amd-light-hic']
}

export class AppState {
  public forceQuit = false

  private _initialized: boolean = false

  private _dark: boolean
  private _highContrast: boolean
  private _theme: Theme

  private _mainWindow: BrowserWindow | undefined

  constructor() {
    this._dark = nativeTheme.shouldUseDarkColors
    this._highContrast = nativeTheme.shouldUseHighContrastColors
    this._theme = getDefaultTheme(this.dark, this.highContrast)
  }

  public async initialize(): Promise<AppState> {
    logger.info('Loading saved settings')
    const [theme, dark, highContrast, mainWindow] = await Promise.all([
      settings.get('theme'),
      settings.get('dark'),
      settings.get('highContrast'),
      createMainWindow()
    ])
    if (Object.keys(Themes).includes(theme?.toString() ?? '')) {
      this._theme = Themes[theme?.toString() ?? '']
    }
    this._dark = !!dark
    this._highContrast = !!highContrast
    this._initialized = true
    this._mainWindow = mainWindow as BrowserWindow
    this._mainWindow.on('close', (event) => {
      logger.info('Closing main window')
      if (mainWindow?.isVisible() && !this.forceQuit) {
        event.preventDefault()
        mainWindow.hide()
      }
    })
    logger.debug('App state initialized: ', this)
    return this
  }

  get initialized(): boolean {
    return this._initialized
  }

  get mainWindow(): BrowserWindow {
    return this._mainWindow as BrowserWindow
  }

  get theme(): Theme {
    return this._theme
  }

  set theme(theme: Themes) {
    settings.set('theme', theme)
    this._theme = theme
  }

  get dark(): boolean {
    return this._dark
  }

  set dark(dark: boolean) {
    this._dark = dark
  }

  get highContrast(): boolean {
    return this._highContrast
  }

  set highContrast(highContrast: boolean) {
    this._highContrast = highContrast
  }
}

export const appState = new AppState()
