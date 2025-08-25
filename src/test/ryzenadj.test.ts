import '/@test/mocks/setup-mocks.ts'

import fs from 'fs'
import path from 'path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { RyzenInfoKeys, RyzenInfoValue, RyzenSetParamsObject } from '../types/ryzenadj'
import { RyzenInputKeyNameMap } from '../types/ryzenadj/params'
import {
  parseRyzenAdjInfo,
  setMultipleRyzenParams,
  setParamAndGetInfo,
  SUCCESS_STRING
} from '/@/main/ryzenadj'
import { runRyzenadjCommand } from '/@/main/ryzenadj/command'

const mocks = vi.hoisted(() => {
  return {
    runRyzenadjCommand: vi.fn()
  }
})

vi.mock('/@/main/ryzenadj/command', async (importActual) => {
  return {
    ...(await importActual()),
    runRyzenadjCommand: mocks.runRyzenadjCommand
  }
})

const fixturePath = path.resolve(__dirname, 'fixtures/ryzenadj-info-output.txt')
const rawOutput = fs.readFileSync(fixturePath, 'utf-8')

function getOutputString(...append: string[]): string {
  if (append.length === 0) {
    append = [SUCCESS_STRING]
  }
  return rawOutput + append.join('\n')
}

const params = new Map<RyzenInfoKeys, RyzenInfoValue>([
  ['STAPM_LIMIT', 45000],
  ['STAPM_VALUE', 8.9],
  ['PPT_LIMIT_FAST', 65000],
  ['PPT_VALUE_FAST', 11.681],
  ['PPT_LIMIT_SLOW', 54000],
  ['PPT_VALUE_SLOW', 11.608],
  ['StapmTimeConst', 275.0],
  ['SlowPPTTimeConst', 5.0],
  ['PPT_LIMIT_APU', 42000],
  ['PPT_VALUE_APU', 11.608],
  ['TDC_LIMIT_VDD', 51.0],
  ['TDC_VALUE_VDD', 6.117],
  ['TDC_LIMIT_SOC', 15.0],
  ['TDC_VALUE_SOC', 2.067],
  ['EDC_LIMIT_VDD', 105.0],
  ['EDC_VALUE_VDD', 55.434],
  ['EDC_LIMIT_SOC', 20.0],
  ['EDC_VALUE_SOC', 0.0],
  ['THM_LIMIT_CORE', 95.0],
  ['THM_VALUE_CORE', 55.262],
  ['STT_LIMIT_APU', 0.0],
  ['STT_VALUE_APU', 0.0],
  ['STT_LIMIT_dGPU', 0.0],
  ['STT_VALUE_dGPU', 0.0],
  ['POWER_SAVING', 'max-performance'],
  ['CCLK_BUSY_VALUE', 26.429]
])

describe('parseRyzenAdjInfo', () => {
  it('parses ryzenadj -i output correctly', () => {
    const info = parseRyzenAdjInfo(rawOutput)

    expect(info).toBeDefined()
    expect(info['CPU_FAMILY']?.value).toBe('Cezanne')
    expect(info['SMU_BIOS']?.value).toBe('18')
    expect(info['RYZENADJ_VERSION']?.value).toBe('v0.17.0')
    expect(info['PM_TABLE_VERSION']?.value).toBe('400005')
    expect(info['PM_TABLE_VERSION']?.value).toBeTypeOf('string')

    for (const key of params.keys()) {
      expect(info[key]?.value).toBe(params.get(key))
      expect(info[key]?.value).toBeTypeOf(typeof params.get(key))
      if (info[key]?.name) {
        expect(info[key]?.name).toBe(RyzenInputKeyNameMap[key])
      }
    }
  })
})

describe('setting params', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('set single param', () => {
    it('calls proper command', async () => {
      mocks.runRyzenadjCommand.mockImplementation(() => getOutputString())
      const result = await setParamAndGetInfo('stapm-limit', 42000)
      expect(runRyzenadjCommand).toHaveBeenCalledWith(
        `bash -c 'ryzenadj --stapm-limit=42000; ryzenadj -i'`
      )
      expect(result.setResult).toBe(true)
      params.keys().forEach((key) => {
        expect(result.newInfo[key]?.value).toBe(params.get(key))
      })
    })

    it('sets error message on error', async () => {
      mocks.runRyzenadjCommand.mockImplementation(() => getOutputString('error:'))
      const result = await setParamAndGetInfo('stapm-limit', 42000)
      expect(runRyzenadjCommand).toHaveBeenCalled()
      expect(result.setResult).toBe(false)
      expect(result.error).toBe('error:')
    })
  })

  describe('set multiple params', () => {
    // proper handling of --power-saving, --max-performance is implicit
    // [ ] TODO: Add --enable-oc, --disable-oc
    it('calls proper command', async () => {
      mocks.runRyzenadjCommand.mockImplementation(() =>
        getOutputString(SUCCESS_STRING, SUCCESS_STRING, SUCCESS_STRING)
      )
      const paramsObject: RyzenSetParamsObject = {
        'stapm-limit': 42000,
        'power-saving': 'power-saving',
        'tctl-temp': 86
      }
      const result = await setMultipleRyzenParams(paramsObject)
      expect(runRyzenadjCommand).toHaveBeenCalledWith(
        `bash -c 'ryzenadj --stapm-limit=42000 --tctl-temp=86 --power-saving; ryzenadj -i'`
      )
      expect(result.setResult).toBe(true)
      params.keys().forEach((key) => {
        expect(result.newInfo[key]?.value).toBe(params.get(key))
      })
    })

    it('fails if success count incorrect', async () => {
      mocks.runRyzenadjCommand.mockImplementation(
        () => getOutputString(SUCCESS_STRING, SUCCESS_STRING) // 2 success, 3 requests
      )
      const paramsObject: RyzenSetParamsObject = {
        'stapm-limit': 42000,
        'power-saving': 'power-saving',
        'tctl-temp': 86
      }
      const result = await setMultipleRyzenParams(paramsObject)
      expect(runRyzenadjCommand).toHaveBeenCalledWith(
        `bash -c 'ryzenadj --stapm-limit=42000 --tctl-temp=86 --power-saving; ryzenadj -i'`
      )
      expect(result.setResult).toBe(false)
    })

    it('passes error message', async () => {
      mocks.runRyzenadjCommand.mockImplementation(() =>
        getOutputString(SUCCESS_STRING, SUCCESS_STRING, 'error:')
      )
      const paramsObject: RyzenSetParamsObject = {
        'stapm-limit': 42000,
        'power-saving': 'power-saving',
        'tctl-temp': 86
      }
      const result = await setMultipleRyzenParams(paramsObject)
      expect(runRyzenadjCommand).toHaveBeenCalledWith(
        `bash -c 'ryzenadj --stapm-limit=42000 --tctl-temp=86 --power-saving; ryzenadj -i'`
      )
      expect(result.setResult).toBe(false)
      expect(result.error).toBe('error:')
    })
  })
})
