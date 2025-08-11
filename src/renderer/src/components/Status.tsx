import { useContext } from 'react'
import InfoTooltip from '/@renderer/components/control/InfoTooltip'
import { RyzenInfoContext } from '/@renderer/lib/context'
import { RyzenParamsDescriptionMap } from '/@types/ryzenadj/param-maps'

function Status({ className = '' }): React.JSX.Element {
  const ryzenInfo = useContext(RyzenInfoContext)
  const powerStrings = {
    'power-saving': 'Power Saving',
    'max-performance': 'Max Performance'
  }

  return (
    <div
      className={`
        text-xs 
        text-base-content
        border-neutral 
        border 
        grid 
        auto-rows-auto
        [&>div]:w-full 
        [&>div]:px-2
        [&>div]:py-1
        [&>div]:not-last:border-b 
        [&>div]:border-neutral
        ${className}`}
    >
      {/* [x] TODO: Update these to look up powerSave string */}
      <div className="grid grid-cols-2">
        <div>CPU Family:</div>
        <div>{`${ryzenInfo.CPU_FAMILY?.value ?? '-'}`}</div>
      </div>
      <div className="grid grid-cols-2">
        <div>RyzenAdj:</div>
        <div>{`${ryzenInfo.RYZENADJ_VERSION?.value ?? '-'}`}</div>
      </div>
      <div className="grid grid-cols-2">
        <div>Power Mode:</div>
        <div>
          {`${powerStrings[ryzenInfo.POWER_SAVING?.value ?? ''] ?? '-'}`}{' '}
          <InfoTooltip
            tooltip={RyzenParamsDescriptionMap[ryzenInfo.POWER_SAVING?.value ?? '']}
            className="h-3 w-3 relative top-[2px]"
            direction="left"
          />
        </div>
      </div>
    </div>
  )
}

export default Status
