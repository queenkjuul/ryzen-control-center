import { ElectronAPI } from '@electron-toolkit/preload';

declare global {
  interface Window {
    electron: ElectronAPI
    api: { ping: VoidFunction; versions: NodeJS.ProcessVersions }
  }
}
