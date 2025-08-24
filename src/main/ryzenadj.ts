import sudo from 'sudo-prompt'
import { APP_NAME as name } from './config/app-name'
import { logger } from './config/logger'
import { RyzenInputKeyNameMap, RyzenNameUnitMap } from '/@/types/ryzenadj/params'
import type {
  RyzenInfo,
  RyzenInfoParams,
  RyzenInfoValue,
  RyzenSetResultAndNewInfo
} from '/@/types/ryzenadj/ryzenadj'

const SUCCESS_STRING = 'Sucessfully' // upstream typo in RyzenAdj

function getValue(line: string): { value: string } {
  return { value: line?.split(':')[1]?.trim() ?? '' }
}

export function parseRyzenAdjInfo(output: string): RyzenInfo {
  logger.info('Parsing ryzenadj -i output')
  const lines = output.split('\n')
  const result: RyzenInfo = {}

  let headerIdx = -1

  for (const [i, line] of lines.entries()) {
    if (line.startsWith('CPU Family')) {
      result['CPU_FAMILY'] = getValue(line)
      continue
    } else if (line.startsWith('SMU BIOS Interface Version')) {
      result['SMU_BIOS'] = getValue(line)
      continue
    } else if (line.startsWith('Version:')) {
      result['RYZENADJ_VERSION'] = getValue(line)
      continue
    } else if (line.startsWith('PM Table')) {
      result['PM_TABLE_VERSION'] = getValue(line)
    } else if (line.includes('Name') && line.includes('Value')) {
      headerIdx = i
      break
    }
  }

  if (headerIdx === -1) return result

  // Skip header and separator
  for (let i = headerIdx + 2; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line.startsWith('|')) continue

    // Remove leading/trailing | and split
    const cols = line
      .slice(1, -1)
      .split('|')
      .map((col) => col.trim())
    if (cols.length !== 3) continue

    const [name, valueStr, parameter] = cols
    const key = name.replaceAll(' ', '_')
    let value: number | string = valueStr
    const num = Number(valueStr)
    if (!isNaN(num)) {
      // values documented as mW are actually reported in W
      value = RyzenNameUnitMap[RyzenInputKeyNameMap[key]]?.includes('mW') ? num * 1000 : num
    }

    result[key] = { value, ...(parameter !== '' ? { parameter } : {}) }
  }

  // not parsed correctly, and also not needed
  delete result['CCLK_BUSY_VALUE']?.name
  delete result['CCLK_Boost_SETPOINT']?.name

  if (result['CCLK_Boost_SETPOINT']?.value === 50) {
    result['POWER_SAVING'] = { value: 'max-performance', name: 'power-saving' }
  } else if (result['CCLK_Boost_SETPOINT']?.value === 95) {
    result['POWER_SAVING'] = { value: 'power-saving', name: 'power-saving' }
  }

  return result
}

function buildRyzenCommand(...args: string[]): string {
  return `ryzenadj ${args}`
}

function runRyzenadjCommand(command: string): Promise<string> {
  logger.info('Running ', command)
  return new Promise((res, rej) => {
    sudo.exec(command, { name }, (error, stdout, stderr) => {
      if (stderr) logger.debug(`${command} stderr: \n`, stderr)
      if (error) rej(error)
      if (stdout) res(typeof stdout === 'string' ? stdout : stdout.toString())
    })
  })
}

export async function getRyzenInfo(): Promise<RyzenInfo> {
  const command = buildRyzenCommand('-i')
  return runRyzenadjCommand(command).then(parseRyzenAdjInfo)
}

export async function setRyzenParam(
  param: RyzenInfoParams,
  value: RyzenInfoValue
): Promise<string> {
  const command = buildRyzenCommand(`--${param}${value ? `=${value}` : ''}`)
  return runRyzenadjCommand(command)
}

// this isn't super elegant...
// problem is each sudo call triggers another prompt,
// so we have to combine commands and parse outputs together
// [ ] TODO: helper function to run arbitrary sequential commands
export async function setParamAndGetInfo(
  param: RyzenInfoParams,
  value: RyzenInfoValue
): Promise<RyzenSetResultAndNewInfo> {
  const output = await runRyzenadjCommand(
    `bash -c 'ryzenadj --${param}${value ? `=${value}` : ''}; ryzenadj -i'`
  )
  const setResult = !!output.split('\n').find((line) => line.includes(SUCCESS_STRING))
  const newInfo = parseRyzenAdjInfo(output)
  return { setResult, newInfo }
}
