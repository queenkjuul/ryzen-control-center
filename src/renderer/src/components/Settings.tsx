import { useContext, useState } from 'react'
import * as ipc from '../lib/ipc-client'
import { validateThemeStructure } from '../lib/theme/theme-validation.js'
import Checkbox from '/@renderer/components/control/Checkbox'
import Select from '/@renderer/components/control/Select'
import ThemePreview from '/@renderer/components/ThemePreview'
import { SettingsContext, type AppSettingsContext } from '/@renderer/lib/context'
import { parseThemeCSS } from '/@renderer/lib/theme/theme-parsing'
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
  const [validationError, setValidationError] = useState<string>('')

  return (
    <>
      <div className="m-2 overflow-y-auto">
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
            disabled={!currentSettings.useCustomTheme || currentSettings.useCustomCss}
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
          <div className="mt-2 flex flex-col gap-4">
            <Checkbox
              label="Use custom CSS"
              disabled={!currentSettings.useCustomTheme}
              defaultChecked={currentSettings.useCustomCss}
              onChange={async (e) => {
                setCurrentSettings(await ipc.setSetting('useCustomCss', e.target.checked))
              }}
            />
            {currentSettings.useCustomCss ? (
              <>
                <div role="alert" className="alert alert-info">
                  <span>
                    You can use any valid DaisyUI theme.{' '}
                    <a
                      className="link"
                      href="https://daisyui.com/theme-generator"
                      target="_blank"
                      rel="noreferrer"
                    >
                      The DaisyUI Theme Generator
                    </a>{' '}
                    can generate CSS for you to paste below.
                  </span>
                </div>
                <textarea
                  className="textarea textarea-primary h-full w-full grow font-mono"
                  disabled={!currentSettings.useCustomCss}
                  defaultValue={currentSettings.customCss}
                  onChange={async (event) => {
                    const rawCss = event.target.value
                    try {
                      const themeObject = parseThemeCSS(rawCss)
                      validateThemeStructure(themeObject)
                      setValidationError('')
                      setCurrentSettings(await ipc.setSetting('customCss', rawCss))
                    } catch (error) {
                      // @ts-ignore untyped library will pass us a { message: string }
                      setValidationError(error.message)
                    }
                  }}
                ></textarea>
                {validationError !== '' ? (
                  <div role="alert" className="alert alert-error">
                    Error! Not a valid theme: {validationError}
                  </div>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}
          </div>
          <ThemePreview />
        </div>
      </div>
    </>
  )
}

export default Settings
