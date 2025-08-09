import { useState } from 'react'

function Versions({ className = '' }): React.JSX.Element {
  const [versions] = useState(window.api?.versions)

  return (
    <div
      className={`
      join 
      bg-base-100
      w-full 
      inline-flex
      flex-wrap
      flex-row 
      justify-around
      text-base-content
      text-xs
      mb-0.5
      [&>div]:mx-2
      [&>div]:grow
      [&>div]:text-center
      [&>.vertical]:not-last:border-r
      [&>.vertical]:not-last:border-neutral
      ${className}`}
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
