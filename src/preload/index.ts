import { contextBridge, ipcRenderer, nativeTheme } from 'electron'
import type { RyzenInfoParams, RyzenInfoValue } from '/@/types/ryzenadj/ryzenadj'
import { version } from '/@/version'

// Custom APIs for renderer
const api = {
  getRyzenInfo: () => ipcRenderer.invoke('getRyzenInfo'),
  setRyzenParam: (param: RyzenInfoParams, value: RyzenInfoValue) =>
    ipcRenderer.invoke('setRyzenParam', param, value),
  ping: () => ipcRenderer.send('ping'),
  versions: process.versions,
  appVersion: version,
  nativeTheme
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.api = api
}
