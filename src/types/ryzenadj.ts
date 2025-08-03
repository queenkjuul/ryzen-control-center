export type RyzenInfoFields =
  | 'CPU_FAMILY'
  | 'SMU_BIOS'
  | 'RYZENADJ_VERSION'
  | 'STAPM_LIMIT'
  | 'STAPM_VALUE'
  | 'PPT_LIMIT_FAST'
  | 'PPT_VALUE_FAST'
  | 'PPT_LIMIT_SLOW'
  | 'PPT_VALUE_SLOW'
  | 'StapmTimeConst'
  | 'SlowPPTTimeConst'
  | 'PPT_LIMIT_APU'
  | 'PPT_VALUE_APU'
  | 'TDC_LIMIT_VDD'
  | 'TDC_VALUE_VDD'
  | 'TDC_LIMIT_SOC'
  | 'TDC_VALUE_SOC'
  | 'EDC_LIMIT_VDD'
  | 'EDC_VALUE_VDD'
  | 'EDC_LIMIT_SOC'
  | 'EDC_VALUE_SOC'
  | 'THM_LIMIT_CORE'
  | 'THM_VALUE_CORE'
  | 'STT_LIMIT_APU'
  | 'STT_VALUE_APU'
  | 'STT_LIMIT_dGPU'
  | 'STT_VALUE_dGPU'
  | 'CCLK_Boost_SETPOINT'
  | 'CCLK_BUSY_VALUE'
  | 'POWER_SAVING'
  | 'MAX_PERFORMANCE'

export const RyzenInfoParamsMap = {
  STAPM_LIMIT: 'stapm-limit',
  PPT_LIMIT_FAST: 'fast-limit',
  PPT_LIMIT_SLOW: 'slow-limit',
  StapmTimeConst: 'stapm-time',
  SlowPPTTimeConst: 'slow-time',
  PPT_LIMIT_APU: 'apu-slow-limit',
  TDC_LIMIT_VDD: 'vrm-current',
  TDC_LIMIT_SOC: 'vrmsoc-current',
  EDC_LIMIT_VDD: 'vrmmax-current',
  EDC_LIMIT_SOC: 'vrmsocmax-current',
  THM_LIMIT_CORE: 'tctl-temp',
  STT_LIMIT_APU: 'apu-skin-temp',
  STT_LIMIT_dGPU: 'dgpu-skin-temp',
  POWER_SAVING: 'power-saving',
  MAX_PERFORMANCE: 'max-performance'
} as const

export type RyzenInfoKeys = keyof typeof RyzenInfoParamsMap
export type RyzenInfoParams = (typeof RyzenInfoParamsMap)[RyzenInfoKeys]
export type RyzenInfoValue = number | string | null

export type RyzenInfo = Partial<
  Record<RyzenInfoFields, { value: RyzenInfoValue; parameter?: RyzenInfoParams }>
>

export type RyzenSetResultAndNewInfo = { setResult: boolean; newInfo: RyzenInfo }
