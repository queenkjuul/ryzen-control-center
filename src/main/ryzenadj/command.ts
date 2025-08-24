import sudo from 'sudo-prompt'
import { APP_NAME as name } from '/@/main/config/app-name'
import { logger } from '/@/main/config/logger'

export function buildRyzenCommand(...args: string[]): string {
  return `ryzenadj ${args}`
}

export function runRyzenadjCommand(command: string): Promise<string> {
  logger.info('Running ', command)
  return new Promise((res, rej) => {
    sudo.exec(command, { name }, (error, stdout, stderr) => {
      if (stderr) logger.debug(`${command} stderr: \n`, stderr)
      if (error) rej(error)
      if (stdout) res(typeof stdout === 'string' ? stdout : stdout.toString())
    })
  })
}
