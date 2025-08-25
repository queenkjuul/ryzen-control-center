import { logger } from '/@/main/config/logger'
import type { RyzenInfo } from '/@/types/ryzenadj'
import { RyzenInputKeyNameMap, RyzenNameUnitMap } from '/@/types/ryzenadj/params'

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
