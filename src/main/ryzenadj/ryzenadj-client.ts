import { buildRyzenCommand, parseRyzenAdjInfo, runRyzenadjCommand } from '/@/main/ryzenadj'
import type {
  RyzenInfo,
  RyzenInfoParams,
  RyzenInfoValue,
  RyzenSetParamsObject,
  RyzenSetResultAndNewInfo
} from '/@types/ryzenadj'

export const SUCCESS_STRING = 'Sucessfully' // upstream typo in RyzenAdj

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
// this isn't really fixable; proper solution is `ryzend` dbus interface
// [x] TODO: helper function to run arbitrary sequential commands
export async function setParamAndGetInfo(
  param: RyzenInfoParams,
  value: RyzenInfoValue
): Promise<RyzenSetResultAndNewInfo> {
  const output = await runRyzenadjCommand(
    `bash -c 'ryzenadj --${param}${value ? `=${value}` : ''}; ryzenadj -i'`
  )
  const error = output.split('\n').find((line) => line.includes('error:'))
  const setResult = !!output.split('\n').find((line) => line.includes(SUCCESS_STRING)) && !error
  const newInfo = parseRyzenAdjInfo(output)
  return { setResult, newInfo, error }
}

export async function setMultipleRyzenParams(
  params: RyzenSetParamsObject
): Promise<RyzenSetResultAndNewInfo> {
  const args: string[] = []
  const entries = Object.entries(params).filter(([k, _v]) => k !== 'power-saving')
  entries.forEach(([param, value]) => {
    args.push(`--${param}${value ? `=${value}` : ''}`)
  })
  if (params['power-saving'] !== undefined) {
    args.push(`--${params['power-saving']}`)
  }
  // need to add case for enable-oc, disable-oc eventually
  const output = await runRyzenadjCommand(`bash -c '${buildRyzenCommand(...args)}; ryzenadj -i'`)
  const lines = output.split('\n')
  const successCount = lines.filter((line) => line.includes(SUCCESS_STRING)).length
  const error = lines.find((line) => line.includes('error:'))
  const setResult = successCount === args.length && !error
  const newInfo = parseRyzenAdjInfo(output)
  return { setResult, newInfo, error }
}
