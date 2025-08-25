import { ElectronAPI } from '@electron-toolkit/preload'
import type { NativeTheme } from 'electron'
import type { AppSettings, AppSettingsKey } from '/@types/app-settings'
import { IpcResponse } from '/@types/ipc'
import type {
  RyzenInfo,
  RyzenInfoParams,
  RyzenInfoValue,
  RyzenSetParamsObject,
  RyzenSetResultAndNewInfo
} from '/@types/ryzenadj'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getRyzenInfo: () => Promise<IpcResponse<RyzenInfo>>
      setRyzenParam: (
        param: RyzenInfoParams,
        value: RyzenInfoValue
      ) => Promise<IpcResponse<RyzenSetResultAndNewInfo>>
      setMultipleRyzenParams: (
        params: RyzenSetParamsObject
      ) => Promise<IpcResponse<RyzenSetResultAndNewInfo>>
      getSettings: () => Promise<IpcResponse<AppSettings>>
      setSetting: <K extends AppSettingsKey>(
        setting: K,
        value: AppSettings[K]
      ) => Promise<IpcResponse<AppSettings>>
      versions: NodeJS.ProcessVersions & { rcc: string }
      appVersion: string
      nativeTheme: NativeTheme
      onSettingsChange: (callback: (value: AppSettings) => void) => void
    }
    logger: {
      log: (any) => void
      warn: (any) => void
      error: (any) => void
    }
  }
}
