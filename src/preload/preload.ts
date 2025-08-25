import { contextBridge, ipcRenderer } from 'electron'
import type { AppSettingsKey, AppSettingsValue } from '/@/types/app-settings'
import type { RyzenInfoParams, RyzenInfoValue, RyzenSetParamsObject } from '/@/types/ryzenadj'
import { version } from '/@/version'

// Custom APIs for renderer
const api = {
  getRyzenInfo: () => ipcRenderer.invoke('getRyzenInfo'),
  setRyzenParam: (param: RyzenInfoParams, value: RyzenInfoValue) =>
    ipcRenderer.invoke('setRyzenParam', param, value),
  setMultipleRyzenParams: (params: RyzenSetParamsObject) =>
    ipcRenderer.invoke('setMultipleRyzenParams', params),
  getSettings: () => ipcRenderer.invoke('getSettings'),
  setSetting: (setting: AppSettingsKey, value: AppSettingsValue) => {
    return ipcRenderer.invoke('setSetting', setting, value)
  },
  versions: { ...process.versions, rcc: version },
  onSettingsChange: (callback) => {
    // each re-render will attempt to register a new listener,
    // so remove the old ones first.
    // only 1 settings listener allowed:
    // use React to pass state down
    ipcRenderer.removeAllListeners('settingsChange')
    ipcRenderer.on('settingsChange', (_event, value) => {
      callback(value)
    })
  }
}

const logger = {
  log: (arg: any) => {
    console.log(arg)
    ipcRenderer.postMessage('log', arg)
  },
  warn: (arg: any) => {
    console.warn(arg)
    ipcRenderer.postMessage('warn', arg)
  },
  error: (arg: any) => {
    console.error(arg)
    ipcRenderer.postMessage('error', arg)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('logger', logger)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.api = api
}
