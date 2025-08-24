// The default DaisyUI approach is kind of weird, because it is pure CSS/Tailwind
// it requires there to be an input element (radio, checkbox) with a value set to the theme you want
// there is no other way to override the default theme
// The DaisyUI docs' example of a drop-down is not to my liking, so I'm just using a hidden control

import { useContext, useEffect, useRef, type ReactElement } from 'react'
import { SettingsContext, type AppSettingsContext } from '/@renderer/lib/context'
import * as ipc from '/@renderer/lib/ipc-client'
import { setTheme } from '/@renderer/lib/theme/theme'

function ThemeController(): ReactElement {
  const themeController = useRef<HTMLInputElement>(null)
  const { settings, setSettings } = useContext<AppSettingsContext>(SettingsContext)

  useEffect(() => {
    if (themeController.current) {
      setTheme(themeController.current, settings)
    }
  }, [settings])

  useEffect(() => {
    ipc
      .getSettings()
      .then(setSettings)
      .then(() => {
        if (themeController.current) {
          setTheme(themeController.current, settings)
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <input
      name="theme-dropdown"
      type="checkbox"
      className="theme-controller hidden"
      defaultChecked={false}
      ref={themeController}
    />
  )
}

export default ThemeController
