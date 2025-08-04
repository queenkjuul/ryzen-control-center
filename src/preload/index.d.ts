import { ElectronAPI } from '@electron-toolkit/preload'
import type { NativeTheme } from 'electron'
import { RyzenInfo } from '../types/ryzenadj/param-maps'
import { IpcResponse } from '/@types/ipc'

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
      versions: NodeJS.ProcessVersions
      appVersion: string
      nativeTheme: NativeTheme
    }
  }
}
