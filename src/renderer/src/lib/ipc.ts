import type { AppSettings, AppSettingsKey } from '/@types/app-settings'
import type { IpcResponse } from '/@types/ipc'
import type { RyzenInfo } from '/@types/ryzenadj/ryzenadj'

export const getRyzenInfo = async (): Promise<IpcResponse<RyzenInfo>> => {
  return window.api.getRyzenInfo()
}

export const getSettings = async (): Promise<AppSettings> => {
  const { data, error } = await window.api.getSettings()
  if (error) {
    console.error(error)
  }
  return data as AppSettings
}

export const setSetting = async <K extends AppSettingsKey>(
  setting: K,
  value: AppSettings[K]
): Promise<AppSettings> => {
  const { data, error } = await window.api.setSetting(setting, value)
  if (error) {
    console.error(error)
  }
  return data as AppSettings
}
