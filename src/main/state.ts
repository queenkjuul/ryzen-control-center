import { BrowserWindow } from 'electron'

type OptionalWindow = BrowserWindow | null

export const appState: {
  mainWindow: OptionalWindow
  aboutWindow: OptionalWindow
  forceQuit: boolean
} = {
  mainWindow: null,
  aboutWindow: null,
  forceQuit: false
}
