import { execSync } from 'child_process'
import { logger } from '../logger'
import { lsbRelease } from './lsb-release'

let systemUlimitS, systemUlimitH

export function ubuntuSetup(): void {
  const lsb = lsbRelease()
  if (
    ('Ubuntu' === lsb?.DISTRIB_ID &&
      lsb?.DISTRIB_RELEASE &&
      parseFloat(lsb.DISTRIB_RELEASE) >= 25) ||
    process.env?.ULIMIT_S ||
    process.env?.ULIMIT_H
  ) {
    logger.info('Running on Ubuntu 25.04+, checking ulimit values')
    try {
      const ulimitS = parseInt(execSync('ulimit -Sn').toString())
      const ulimitH = parseInt(execSync('ulimit -Hn').toString())
      const thresholdS = parseInt(process.env?.ULIMIT_S ?? '524288') // value works on my machine?
      const thresholdH = parseInt(process.env?.ULIMIT_H ?? '524288') // Will have to do more testing - can go as low as 1024

      logger.debug(`Found ulimit values: ${JSON.stringify({ ulimitS, ulimitH })}`)

      if (ulimitS > thresholdS) {
        systemUlimitS = ulimitS // save, we will restore later
        execSync(`ulimit -Sn ${thresholdS}`)
        logger.info(`Set ulimit -Sn: ${thresholdS}`)
      } else {
        logger.info('ulimit -Sn within limits, not updating')
      }
      if (ulimitH > thresholdH) {
        systemUlimitH = ulimitH // save, we will restore later
        execSync(`ulimit -Sn ${thresholdH}`)
        logger.info(`Set ulimit -Hn: ${thresholdH}`)
      } else {
        logger.info('ulimit -Hn within limits, not updating')
      }
    } catch (_e) {
      logger.warn(
        'Detected Ubuntu 25.04+, but failed to correct ulimit values. This may cause problems when applying values. For more information, see // https://github.com/polkit-org/polkit/issues/572'
      )
    }
  }
}

export function ubuntuTeardown(): void {
  try {
    if (systemUlimitS) {
      logger.debug('Resetting ulimit -Sn to ', systemUlimitS)
      execSync(`ulimit -Sn ${systemUlimitS}`)
    }
    if (systemUlimitH) {
      logger.debug('Resetting ulimit -Hn to ', systemUlimitH)
      execSync(`ulimit -Hn ${systemUlimitH}`)
    }
  } catch (e) {
    logger.error('Failed to reset ulimits to previous system values', e)
  }
}
