import { useContext } from 'react'
import * as ipc from '../lib/ipc-client'
import Checkbox from '/@renderer/components/control/Checkbox'
import Select from '/@renderer/components/control/Select'
import ThemePreview from '/@renderer/components/ThemePreview'
import { SettingsContext, type AppSettingsContext } from '/@renderer/lib/context'
import type { ThemeSource } from '/@types/app-settings'
import { darkThemes, lightThemes } from '/@types/themes'

const themeSourceLabels = {
  system: 'System',
  dark: 'Dark',
  light: 'Light'
}
function Settings(): React.JSX.Element {
  const { settings: currentSettings, setSettings: setCurrentSettings } =
    useContext<AppSettingsContext>(SettingsContext)

  return (
    <>
      <div className="m-2">
        <h2 className="mb-2 text-2xl">Settings</h2>
        <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2">
          <Checkbox
            label="Force High Contrast Theme"
            disabled={currentSettings.useCustomTheme}
            defaultChecked={currentSettings.forceHighContrast}
            onChange={async (e) => {
              await ipc.setSetting('forceHighContrast', e.target.checked)
              setCurrentSettings(await ipc.setSetting('useCustomTheme', false))
            }}
          />
          <Select
            label="Theme Mode"
            disabled={currentSettings.useCustomTheme}
            options={Object.keys(themeSourceLabels).map((value) => ({
              label: themeSourceLabels[value],
              value
            }))}
            value={currentSettings.themeSource}
            onChange={(e) => {
              ipc.setSetting('themeSource', e.target.value as ThemeSource).then(setCurrentSettings)
            }}
          />
          <Checkbox
            label="Use custom theme"
            disabled={currentSettings.forceHighContrast}
            defaultChecked={currentSettings.useCustomTheme}
            onChange={(e) => {
              ipc.setSetting('useCustomTheme', e.target.checked).then(setCurrentSettings)
            }}
          />
          <Select
            label="Custom Theme"
            disabled={!currentSettings.useCustomTheme}
            options={[
              ...darkThemes.map((theme) => ({
                value: theme,
                label: `🌙 ${theme}`
              })),
              ...lightThemes.map((theme) => ({
                value: theme,
                label: `☀️ ${theme}`
              }))
            ]}
            value={currentSettings.theme}
            onChange={async (e) => {
              const theme = e.target.value
              const dark = darkThemes.includes(theme)
              await ipc.setSetting('dark', dark)
              setCurrentSettings(await ipc.setSetting('theme', theme))
            }}
          />
          <div />
          <ThemePreview />
        </div>
      </div>
    </>
  )
}

export default Settings
