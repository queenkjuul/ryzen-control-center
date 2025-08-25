import type { AppSettings, AppSettingsKey } from '/@types/app-settings'
import type { IpcResponse } from '/@types/ipc'
import type {
  RyzenInfo,
  RyzenInfoParams,
  RyzenInfoValue,
  RyzenSetResultAndNewInfo
} from '/@types/ryzenadj'

const checkForErrors = <T>(response: IpcResponse<T>): T => {
  if (response.error) {
    window.logger.error(response.error)
    throw new Error(response.error)
  }
  if (!response.data) {
    const error = new Error('No data returned with response!')
    window.logger.error(error)
    throw error
  }
  return response.data as T
}

export const getRyzenInfo = async (): Promise<RyzenInfo> => {
  return checkForErrors(await window.api.getRyzenInfo())
}

export const setRyzenParam = async (
  param: RyzenInfoParams,
  value: RyzenInfoValue
): Promise<RyzenSetResultAndNewInfo> => {
  return checkForErrors(await window.api.setRyzenParam(param, value))
}

export const getSettings = async (): Promise<AppSettings> => {
  return checkForErrors(await window.api.getSettings())
}

export const setSetting = async <K extends AppSettingsKey>(
  setting: K,
  value: AppSettings[K]
): Promise<AppSettings> => {
  return checkForErrors(await window.api.setSetting(setting, value))
}
