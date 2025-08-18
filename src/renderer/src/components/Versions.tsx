import { useState } from 'react'

function Versions({ className = '' }: { className?: string }): React.JSX.Element {
  const [versions] = useState(window.api?.versions)

  return (
    <div
      className={`join bg-base-100 text-base-content [&>.vertical]:not-last:border-neutral mb-0.5 inline-flex w-full flex-row flex-wrap justify-around text-xs [&>.vertical]:not-last:border-r [&>div]:mx-2 [&>div]:grow [&>div]:text-center ${className}`}
    >
      <div className="join-item electron-version">Electron v{versions?.electron}</div>
      {/* <div className="vertical" /> */}
      <div className="join-item chrome-version">Chromium v{versions?.chrome}</div>
      {/* <div className="vertical" /> */}
      <div className="join-item node-version">Node v{versions?.node}</div>
      {/* <div className="vertical" /> */}
      <div className="join-item app-version">Ryzen Control Center v{versions?.rcc}</div>
    </div>
  )
}

export default Versions
