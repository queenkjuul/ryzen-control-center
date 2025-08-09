function Status({ cpuFam, powerSave, className = '' }): React.JSX.Element {
  return (
    <div
      className={`
        text-xs 
        text-base-content
        h-full 
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
      {/* TODO: Update these to look up powerSave string */}
      <div className="grid grid-cols-2">
        <div>CPU Family:</div>
        <div>{`${cpuFam ?? '-'}`}</div>
      </div>
      <div className="grid grid-cols-2">
        <div>Power Mode:</div>
        <div>{`${powerSave ?? '-'}`}</div>
      </div>
    </div>
  )
}

export default Status
