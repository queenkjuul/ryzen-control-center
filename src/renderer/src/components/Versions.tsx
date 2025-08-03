import { useState } from 'react'

function Versions(): React.JSX.Element {
  console.log(window.api.appVersion)
  const [versions] = useState(window.api.versions)
  const appVersion = window.api.appVersion

  return (
    <ul className="list bg-base-100 rounded-box shadow-md">
      <li className="list-row electron-version">Electron v{versions.electron}</li>
      <li className="list-row chrome-version">Chromium v{versions.chrome}</li>
      <li className="list-row node-version">Node v{versions.node}</li>
      <li className="list-row app-version">Ryzen Control Center v{appVersion}</li>
    </ul>
  )
}

export default Versions
