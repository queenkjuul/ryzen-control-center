import { createContext, type Dispatch, type SetStateAction } from 'react'
import type { AppSettings } from '/@types/app-settings'
import { RyzenInfo, type RyzenInfoParams, type RyzenInfoValue } from '/@types/ryzenadj'

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
  setRyzenParam: (param: RyzenInfoParams, value: RyzenInfoValue) => Promise<void>
}

export const RyzenInfoContext = createContext<RyzenInfoContext>({
  ryzenInfo: {},
  setRyzenInfo: () => {},
  getRyzenInfo: () => new Promise((res) => res()),
  setRyzenParam: (_p, _v) => new Promise((res) => res())
})
