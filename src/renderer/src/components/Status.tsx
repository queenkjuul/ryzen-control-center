import { useContext, type ReactElement } from 'react'
import { RyzenInfoContext } from '/@renderer/lib/context'

function Status({ className = '' }: { className?: string }): ReactElement {
  const { ryzenInfo } = useContext(RyzenInfoContext)

  return (
    <div
      className={`text-base-content border-neutral [&>div]:border-neutral grid auto-rows-auto border text-xs [&>div]:w-full [&>div]:px-2 [&>div]:py-1 [&>div]:not-last:border-b ${className}`}
    >
      {/* [x] TODO: Update these to look up powerSave string */}
      <div className="grid grid-cols-2 gap-0.5">
        <div>CPU Family: </div>
        <div>{`${ryzenInfo.CPU_FAMILY?.value ?? '-'}`}</div>
      </div>
      <div className="grid grid-cols-2">
        <div>RyzenAdj:</div>
        <div>{`${ryzenInfo.RYZENADJ_VERSION?.value ?? '-'}`}</div>
      </div>
    </div>
  )
}

export default Status
