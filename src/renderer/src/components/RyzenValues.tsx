import cn from '@meltdownjs/cn'
import { useContext, type ReactElement } from 'react'
import InfoTooltip from '/@renderer/components/control/InfoTooltip'
import { RyzenInfoContext } from '/@renderer/lib/context'
import {
  RyzenInputKeyNameMap,
  RyzenNameUnitMap,
  RyzenParamsNameDescriptionMap
} from '/@types/ryzenadj/params'
import type { ClassName } from '/@types/ui/class-name'

function RyzenValues({ className }: ClassName): ReactElement {
  const { ryzenInfo } = useContext(RyzenInfoContext)

  return (
    <div className={cn('grow overflow-auto transition-all duration-200', className)}>
      <div className="swap-on border-neutral m-2 rounded border">
        <table id="ryzenValues" className="table-zebra table">
          <thead>
            <tr>
              <td className="bg-base-300 rounded-tl-md">Key</td>
              <td className="bg-base-300 rounded-tr-md">Value</td>
            </tr>
          </thead>
          <tbody>
            {Object.keys(ryzenInfo).map((key) => {
              // exclude some info - mainly things shown in Status header
              if (
                ['CPU_FAMILY', 'SMU_BIOS', 'RYZENADJ_VERSION', 'PM_TABLE_VERSION'].includes(key)
              ) {
                return
              }
              const desc = RyzenParamsNameDescriptionMap[RyzenInputKeyNameMap[key]]
              const unit = RyzenNameUnitMap[RyzenInputKeyNameMap[key]]
              return (
                <tr key={key}>
                  <td className="flex flex-row items-center gap-2">
                    {key}
                    <InfoTooltip className="mb-0.5 h-4 w-4" tooltip={desc} direction="right" />
                  </td>
                  <td>
                    {ryzenInfo[key].value}
                    {`${unit ? ` ${unit}` : ''}`}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RyzenValues
