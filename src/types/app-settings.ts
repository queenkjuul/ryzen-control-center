/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

// look, I only want one central list of settings keys.
// This was how I figured out to do what I need
// AppSettingsClass is only used as a type,
// so we can safely ignore the TS/ESLint errors

import type { Theme } from '/@/types/themes'

let safe = true

export type ThemeSource = typeof Electron.nativeTheme.themeSource

export class AppSettingsClass {
  themeSource: ThemeSource
  useCustomTheme: boolean
  highContrast: boolean
  forceHighContrast: boolean
  theme: Theme
  dark: boolean
  useCustomCss: boolean
  customCss: string

  constructor() {
    if (!safe) {
      throw new Error('Don\t instantiate AppSettingsClass! It is only used for enumerating types')
    }
  }
}

export interface AppSettings extends AppSettingsClass {}

export type AppSettingsKey = keyof AppSettings
export type AppSettingsValue = AppSettings[AppSettingsKey]

export const appSettingsKeys: AppSettingsKey[] = Object.keys(new AppSettingsClass())

safe = false
