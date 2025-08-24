import { createContext, type Dispatch, type SetStateAction } from 'react'
import type { AppSettings } from '/@types/app-settings'
import { RyzenInfo } from '/@types/ryzenadj/ryzenadj'

export type AppSettingsContext = {
  settings: Partial<AppSettings>
  setSettings: Dispatch<SetStateAction<Partial<AppSettings>>>
}

export const SettingsContext = createContext<AppSettingsContext>({
  settings: {},
  setSettings: () => {}
})

export type RyzenInfoContext = {
  ryzenInfo: RyzenInfo
  setRyzenInfo: Dispatch<SetStateAction<RyzenInfo>>
  getRyzenInfo: () => Promise<void>
}

export const RyzenInfoContext = createContext<RyzenInfoContext>({
  ryzenInfo: {},
  setRyzenInfo: () => {},
  getRyzenInfo: () => new Promise((res) => res())
})
