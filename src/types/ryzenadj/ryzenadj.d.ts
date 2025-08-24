import { RyzenInputKeyNameMap, type RyzenInfoKeysList, type RyzenInfoNamesList } from './params'

export type RyzenInfoKeys = (typeof RyzenInfoKeysList)[number]

export type RyzenInfoNameMappedKey = keyof typeof RyzenInputKeyNameMap
export type RyzenInfoParams = (typeof RyzenInputKeyNameMap)[RyzenInfoKeys]
export type RyzenInfoValue = number | string | null

export type RyzenInfo = Partial<
  Record<RyzenInfoKeys, { value: RyzenInfoValue; name?: RyzenInfoParams }>
>

export type RyzenSetResultAndNewInfo = { setResult: boolean; newInfo: RyzenInfo }

export type RyzenInfoNames = (typeof RyzenInfoNamesList)[number]
