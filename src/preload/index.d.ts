import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    // we don't use ElectonAPI, and don't expose it via ContextBridge
    // yet, if I delete it from this interface, TypeScript loses its mind
    electron: ElectronAPI
    api: { ping: VoidFunction; versions: NodeJS.ProcessVersions }
  }
}
