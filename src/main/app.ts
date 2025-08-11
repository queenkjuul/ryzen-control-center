// Default open or close DevTools by F12 in development
// and ignore CommandOrControl + R in production.

import { optimizer } from '@electron-toolkit/utils'
import { app } from 'electron'
import { logger } from '/@/main/config/logger'
import { ubuntuTeardown } from '/@/main/ubuntu'
import { sillySaying } from '/@/main/util/silly'

// see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
app.on('browser-window-created', (_, window) => {
  optimizer.watchWindowShortcuts(window, {})
})
app.on('will-quit', () => {
  logger.debug('Preparing to quit')
  ubuntuTeardown()
  logger.silly(sillySaying())
  logger.silly('Done.')
  logger.silly('Have a nice day!')
})
