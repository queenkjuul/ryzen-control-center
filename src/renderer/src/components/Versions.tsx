import { useState } from 'react'

function Versions(): React.JSX.Element {
  console.log(window.api.appVersion)
  const [versions] = useState(window.api.versions)
  const [appVersion] = useState(window.api.appVersion)

  return (
    <ul className="versions">
      <li className="electron-version">Electron v{versions.electron}</li>
      <li className="chrome-version">Chromium v{versions.chrome}</li>
      <li className="node-version">Node v{versions.node}</li>
      <li className="app-version">App v{appVersion}</li>
    </ul>
  )
}

export default Versions
