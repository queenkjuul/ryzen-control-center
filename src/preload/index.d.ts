import { ElectronAPI } from '@electron-toolkit/preload'
import { IpcResponse } from '/@types/ipc'
import { RyzenInfo } from '/@types/ryzenadj'

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
    }
  }
}
