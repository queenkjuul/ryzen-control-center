import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/16/solid'
import { ArrowTopRightOnSquareIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import cn from '@meltdownjs/cn'
import { useContext, useEffect, useRef, useState, type ReactElement } from 'react'
import * as ipc from '/@lib/ipc-client'
import Button from '/@renderer/components/control/Button'
import { RyzenInfoContext } from '/@renderer/lib/context'
import { populated, swapKeysAndValues } from '/@renderer/lib/util'
import type { RyzenInfoKeys, RyzenInfoNames, RyzenSetParamsObject } from '/@types/ryzenadj'
import {
  RyzenInfoNamesList,
  RyzenInputKeyNameMap,
  RyzenNameUnitMap,
  RyzenParamsNameDescriptionMap
} from '/@types/ryzenadj/params'

const ignoredSettings = ['power-saving', 'max-performance', 'enable-oc', 'disable-oc']

const basicSettingsNames = Object.values(RyzenInputKeyNameMap).filter(
  (v) => !ignoredSettings.includes(v)
)
const basicSettingsNameKeyMap: Record<RyzenInfoNames, RyzenInfoKeys> =
  swapKeysAndValues(RyzenInputKeyNameMap)

const advancedSettingsNames = RyzenInfoNamesList.filter((v) => !basicSettingsNames.includes(v))

function RyzenInputRow({
  name,
  value,
  advanced = false,
  onChange
}: {
  name: string
  value?: any
  advanced?: boolean
  onChange?: (e: any) => void
}): ReactElement {
  const description = RyzenParamsNameDescriptionMap[name]
  return (
    <tr className="w-full px-2" key={name}>
      <td>{description}</td>
      {advanced ? (
        <></>
      ) : (
        <td>
          {value} {RyzenNameUnitMap[name]}
        </td>
      )}
      <td className="flex flex-row items-center justify-start gap-1">
        <input
          type="number"
          className="input validator shrink valid:border-stone-600 valid:outline-0"
          min="0"
          defaultValue={value ?? 0}
          onChange={onChange}
          required
        />
        <span className="basis-10 text-xs">{RyzenNameUnitMap[name]}</span>
      </td>
    </tr>
  )
}

function RyzenAdjust(): ReactElement {
  const { ryzenInfo, setRyzenInfo } = useContext(RyzenInfoContext)

  const containerRef = useRef<HTMLDivElement>(null)
  const advancedRef = useRef<HTMLDivElement>(null)

  const [showAdvanced, setShowAdvanced] = useState<boolean>(false)
  const [newRyzenInfo, setNewRyzenInfo] = useState<RyzenSetParamsObject>({})
  const [dirty, setDirty] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    console.log(newRyzenInfo)
    setDirty(populated(newRyzenInfo))
  }, [newRyzenInfo])

  const apply = async (_e): Promise<void> => {
    const data = await ipc.setMultipleRyzenParams(newRyzenInfo)
    setRyzenInfo(data.newInfo)
    setError(data.error ?? '')
    if (data.setResult) {
      setNewRyzenInfo({})
    }
  }

  return (
    <>
      <div
        className="m-4 mr-2 mb-0 grow overflow-y-scroll pr-2 pb-4 transition-all duration-200"
        ref={containerRef}
      >
        <div className={cn('alert alert-error mb-2 rounded-md', !error && 'hidden')}>
          <ExclamationCircleIcon className="w-8" />
          {error}
        </div>
        <div className="border-neutral rounded border">
          <table id="ryzenInputs" className="table-zebra table">
            <thead className="bg-base-300">
              <tr>
                <td className="rounded-tl-md">Key</td>
                <td>Current Value</td>
                <td className="rounded-tr-md">New Value</td>
              </tr>
            </thead>
            <tbody>
              {basicSettingsNames.map((name) => {
                const key = basicSettingsNameKeyMap[name]
                return (
                  <RyzenInputRow
                    name={name}
                    value={ryzenInfo[key]?.value}
                    onChange={(e) => {
                      setNewRyzenInfo({ ...newRyzenInfo, [name]: e.target.value })
                    }}
                    key={key}
                  />
                )
              })}
              <tr className="w-full px-2" key="power-saving">
                <td>Power Mode</td>
                <td>
                  {ryzenInfo.POWER_SAVING?.value === 'max-performance'
                    ? 'Max Performance'
                    : 'Power Saving'}
                </td>
                <td className="flex flex-row items-center justify-start gap-1">
                  <select
                    defaultValue={ryzenInfo.POWER_SAVING?.value ?? 'max-performance'}
                    className="select"
                    onChange={(e) => {
                      setNewRyzenInfo({ ...newRyzenInfo, 'power-saving': e.target.value })
                    }}
                  >
                    <option value="power-saving">Power Saving</option>
                    <option value="max-performance">Max Performance</option>
                  </select>
                  <div className="grow basis-10"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="border-primary collapse mt-2 rounded border p-0" ref={advancedRef}>
          <input
            type="checkbox"
            checked={showAdvanced}
            id="advanced"
            onChange={(e) => {
              setShowAdvanced(e.target.checked)
              if (!showAdvanced) {
                setTimeout(() => {
                  const container = containerRef.current
                  const advanced = advancedRef.current
                  if (container && advanced) {
                    container.scroll({
                      behavior: 'smooth',
                      top: advanced.offsetTop - 140
                    })
                  }
                }, 100)
              }
            }}
          />
          <div className="collapse-title flex flex-row items-center justify-between">
            <div>Advanced Settings</div>
            {showAdvanced ? <ChevronUpIcon className="w-8" /> : <ChevronDownIcon className="w-8" />}
          </div>
          <div className="collapse-content p-0">
            <div className="alert alert-warning border-y-primary rounded-none border-y">
              <span>
                Do not adjust these settings unless you know what you are doing. <br />
                It is not generally necessary or useful to adjust these settings. <br />
                Be sure to refer to the{' '}
                <a
                  className="link-warning-content link"
                  href="https://github.com/FlyGoat/RyzenAdj/wiki/Options"
                  target="_blank"
                  rel="noreferrer"
                >
                  RyzenAdj Wiki <ArrowTopRightOnSquareIcon className="mb-1 inline-block w-3" />
                </a>{' '}
                before touching these settings.
              </span>
            </div>
            <table id="ryzenInputs" className="table-zebra table">
              <thead className="bg-base-300">
                <tr>
                  <td>Key</td>
                  <td>New Value</td>
                </tr>
              </thead>
              <tbody>
                {advancedSettingsNames.map((name) => {
                  const key = basicSettingsNameKeyMap[name]
                  if (key === 'POWER_SAVING' || key === 'MAX_PERFORMANCE') {
                    return <></>
                  }
                  return <RyzenInputRow name={name} advanced key={key} />
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="bg-base-300 mb-0 flex flex-row items-center justify-end gap-2 p-4 pr-[34px] transition-all duration-200">
        <div className="grow"></div>
        {/* [ ] TODO: Figure out OC enable/disable UI */}
        {/* maybe todo maybe not: use RyzenAdj support table to dynamically 
        show/hide based on platform support (e.g. Renoir+) */}
        {/* <Button label="Disable OC" className="btn-accent" />
        <Button label="Enable OC" className="btn-secondary" /> */}
        <Button label="Save As Preset" className="btn-accent" disabled />
        <Button
          label="Apply Settings"
          className="btn-primary"
          tooltip="Requires Admin Password"
          disabled={!dirty}
          onClick={apply}
        />
      </div>
    </>
  )
}

export default RyzenAdjust
