import { ElectronAPI } from '@electron-toolkit/preload'
import type { NativeTheme } from 'electron'
import type { AppSettings, AppSettingsKey } from '/@types/app-settings'
import { IpcResponse } from '/@types/ipc'
import type { RyzenInfo, RyzenInfoParams, RyzenInfoValue } from '/@types/ryzenadj/ryzenadj'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getRyzenInfo: () => Promise<IpcResponse<RyzenInfo>>
      setRyzenParam: (
        param: RyzenInfoParams,
        value: RyzenInfoValue
      ) => IpcResponse<{ setResult: string; newInfo: RyzenInfo }>
      getSettings: () => IpcResponse<AppSettings>
      setSetting: <K extends AppSettingsKey>(
        setting: K,
        value: AppSettings[K]
      ) => IpcResponse<AppSettings>
      versions: NodeJS.ProcessVersions & { rcc: string }
      appVersion: string
      nativeTheme: NativeTheme
      onHighContrast: (callback: (value: boolean) => void) => void
    }
  }
}
