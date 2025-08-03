import '/@test/mocks/setup-mocks.ts'

import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'
import { parseRyzenAdjInfo } from '/@/main/ryzenadj'
import { RyzenInfoFields, RyzenInfoParamsMap, RyzenInfoValue } from '/@types/ryzenadj'

describe('parseRyzenAdjInfo', () => {
  it('parses ryzenadj -i output correctly', () => {
    const fixturePath = path.resolve(__dirname, 'fixtures/ryzenadj-info-output.txt')
    const rawOutput = fs.readFileSync(fixturePath, 'utf-8')
    const info = parseRyzenAdjInfo(rawOutput)

    expect(info).toBeDefined()
    expect(info['CPU_FAMILY']?.value).toBe('Cezanne')
    expect(info['SMU_BIOS']?.value).toBe('18')
    expect(info['RYZENADJ_VERSION']?.value).toBe('v0.17.0')
    expect(info['PM_TABLE_VERSION']?.value).toBe('400005')
    expect(info['PM_TABLE_VERSION']?.value).toBeTypeOf('string')

    const params = new Map<RyzenInfoFields, RyzenInfoValue>([
      ['STAPM_LIMIT', 45.0],
      ['STAPM_VALUE', 8.9],
      ['PPT_LIMIT_FAST', 65.0],
      ['PPT_VALUE_FAST', 11.681],
      ['PPT_LIMIT_SLOW', 54.0],
      ['PPT_VALUE_SLOW', 11.608],
      ['StapmTimeConst', 275.0],
      ['SlowPPTTimeConst', 5.0],
      ['PPT_LIMIT_APU', 42.0],
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

    for (const key of params.keys()) {
      expect(info[key]?.value).toBe(params.get(key))
      expect(info[key]?.value).toBeTypeOf(typeof params.get(key))
      if (info[key]?.parameter) {
        expect(info[key]?.parameter).toBe(RyzenInfoParamsMap[key])
      }
    }
  })
})
