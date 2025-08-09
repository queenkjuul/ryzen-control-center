import { useState } from 'react'
import * as ipc from '/@lib/ipc'
import Checkbox from '/@renderer/components/control/Checkbox'
import Select from '/@renderer/components/control/Select'
import type { ThemeSource } from '/@types/app-settings'

const themeSourceLabels = {
  system: 'System',
  dark: 'Dark',
  light: 'Light'
}
function Settings(): React.JSX.Element {
  const [customTheme, setCustomTheme] = useState<boolean>(false)
  return (
    <>
      <div className="m-2">
        <h2 className="text-2xl mb-2">Settings</h2>
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2">
          <Select
            label="Theme Source"
            disabled={customTheme}
            options={Object.keys(themeSourceLabels).map((value) => ({
              label: themeSourceLabels[value],
              value
            }))}
            onChange={(e) => {
              ipc.setSetting('themeSource', e.target.value as ThemeSource)
            }}
          />
          <Checkbox label="Use custom theme" onChange={() => setCustomTheme(!customTheme)} />
        </div>
      </div>
    </>
  )
}

export default Settings
