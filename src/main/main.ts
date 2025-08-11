import { electronApp } from '@electron-toolkit/utils'
import { app } from 'electron'
import { APP_NAME } from './config/app-name'
import { logger } from './config/logger'
import { appState } from './state'
import { ubuntuSetup } from './ubuntu'
import { sillySaying } from './util/silly'
import { setupIpcServer } from '/@/main/ipc-server'
import { version } from '/@/version.js'

function silly(): void {
  logger.silly(sillySaying())
}

console.log(`
${APP_NAME}
Version ${version}
(C) 2025 Queen K Juul
Distributed under the terms of the GNU GPL v3 License, except where noted
=========================================================================

`)

silly()

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // INIT
  // =================================
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  logger.info('Gathering system information')

  // TODO: Need to actually check for ryzenadj binary and short-circuit if not
  // can it be done before app.whenReady()?
  // logger.info('Checking for ryzenadj')

  // sudo-prompt (or rather, pkexec) won't work right on Ubuntu 25+ without a workaround.
  // I've raised an issue with the polkit team as this problem affects all node processes,
  // not just VSCode:
  //
  // https://github.com/polkit-org/polkit/issues/572
  //
  // workaround comes from here:
  //
  // https://github.com/microsoft/vscode/issues/237427#issuecomment-2582881451
  if (process.platform === 'linux') {
    ubuntuSetup()
  }

  // STATE
  // ==================================
  logger.info('Initializing app state')
  await appState.initialize()

  // IPC
  // =================================================
  logger.info('Setting up IPC listeners and handlers')
  await setupIpcServer()

  // APP
  // =========================================
  logger.info('Setting up app event listners')
  await import('/@/main/app')

  // READY
  logger.info('Main process initialized')
})
