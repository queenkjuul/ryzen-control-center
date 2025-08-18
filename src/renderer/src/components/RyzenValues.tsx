import { useContext, useEffect, useState } from 'react'
import InfoTooltip from '/@renderer/components/control/InfoTooltip'
import { RyzenInfoContext } from '/@renderer/lib/context'
import {
  RyzenInfoFieldsMap,
  RyzenParamsDescriptionMap,
  RyzenParamsUnitsMap
} from '/@types/ryzenadj/param-maps'

function populated(obj): boolean {
  return Object.keys(obj).length !== 0
}

function RyzenValues(): React.JSX.Element {
  const ryzenInfo = useContext(RyzenInfoContext)
  const [haveData, setHaveData] = useState<boolean>(populated(ryzenInfo))

  useEffect(() => {
    setHaveData(populated(ryzenInfo))
  }, [ryzenInfo])

  return (
    <div className="grow overflow-auto">
      <label
        htmlFor="ryzenValues"
        className={`swap w-full cursor-default ${haveData ? 'swap-active' : ''}`}
      >
        <div className="swap-off text-center">
          Press &quot;Get System Status&quot; to view current power values <br />
          (Requires admin password)
        </div>
        <div className="swap-on border-neutral m-2 rounded border">
          <table id="ryzenValues" className="table-zebra table">
            <thead>
              <tr>
                <td>Key</td>
                <td>Value</td>
              </tr>
            </thead>
            <tbody>
              {Object.keys(ryzenInfo).map((key) => {
                // exclude some info
                if (
                  ['CPU_FAMILY', 'SMU_BIOS', 'RYZENADJ_VERSION', 'PM_TABLE_VERSION'].includes(key)
                ) {
                  return
                }
                // hide input values
                if (ryzenInfo[key]['parameter']) {
                  return
                }
                const desc = RyzenParamsDescriptionMap[RyzenInfoFieldsMap[key]]
                const unit = RyzenParamsUnitsMap[RyzenInfoFieldsMap[key]]
                return (
                  <tr key={key}>
                    <td className="flex flex-row items-center gap-2">
                      {desc || key}
                      <InfoTooltip
                        className="mb-0.5 h-4 w-4"
                        tooltip={desc && key}
                        direction="right"
                      />
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
      </label>
    </div>
  )
}

export default RyzenValues
