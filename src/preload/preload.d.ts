import { ElectronAPI } from '@electron-toolkit/preload'
import type { NativeTheme } from 'electron'
import { IpcResponse } from '/@types/ipc'
import type { RyzenInfo, RyzenInfoParams, RyzenInfoValue } from '/@types/ryzenadj/ryzenadj'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getRyzenInfo: () => RyzenInfo
      setRyzenParam: (
        param: RyzenInfoParams,
        value: RyzenInfoValue
      ) => IpcResponse<{ setResult: string; newInfo: RyzenInfo }>
      ping: VoidFunction
      versions: NodeJS.ProcessVersions & { rcc: string }
      appVersion: string
      nativeTheme: NativeTheme
      onHighContrast: (callback: (value: boolean) => void) => void
    }
  }
}
