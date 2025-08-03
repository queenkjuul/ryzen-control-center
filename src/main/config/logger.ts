import { is } from '@electron-toolkit/utils'
import { ILogObj, Logger } from 'tslog'

const { DEBUG_LOG, LOG_LEVEL } = process.env

const minLevel = is.dev ? 0 : LOG_LEVEL ? parseInt(LOG_LEVEL) : DEBUG_LOG ? 2 : 3

export const logger: Logger<ILogObj> = new Logger({
  minLevel,
  prettyLogStyles: {
    logLevelName: {
      '*': ['bold', 'black', 'bgWhiteBright', 'dim'],
      SILLY: ['bold', 'magenta'],
      TRACE: ['bold', 'whiteBright'],
      DEBUG: ['bold', 'green'],
      INFO: ['bold', 'blue'],
      WARN: ['bold', 'yellow'],
      ERROR: ['bold', 'red'],
      FATAL: ['bold', 'redBright']
    }
  }
})
