import { buildRyzenCommand, parseRyzenAdjInfo, runRyzenadjCommand } from '/@/main/ryzenadj'
import type {
  RyzenInfo,
  RyzenInfoParams,
  RyzenInfoValue,
  RyzenSetResultAndNewInfo
} from '/@/types/ryzenadj/ryzenadj'

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
