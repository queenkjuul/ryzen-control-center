import { useState } from 'react'

function Versions(): React.JSX.Element {
  const [versions] = useState(window.api?.versions)

  return (
    <div
      className="
      join 
      bg-base-100 
      rounded-box 
      shadow-md 
      w-full 
      flex 
      flex-row 
      justify-around 
      [&>div]:mx-2
      [&>.vertical]:not-last:border-r
      [&>.vertical]:not-last:border-neutral"
    >
      <div className="join-item electron-version">Electron v{versions?.electron}</div>
      <div className="vertical" />
      <div className="join-item chrome-version">Chromium v{versions?.chrome}</div>
      <div className="vertical" />
      <div className="join-item node-version">Node v{versions?.node}</div>
      <div className="vertical" />
      <div className="join-item app-version">Ryzen Control Center v{versions?.rcc}</div>
    </div>
  )
}

export default Versions
