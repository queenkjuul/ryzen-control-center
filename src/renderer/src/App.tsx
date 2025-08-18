import { ArrowTopRightOnSquareIcon, Cog6ToothIcon, XMarkIcon } from '@heroicons/react/16/solid'
import { useEffect, useState } from 'react'
import darkLogo from './assets/ryzen-logo-dark.png'
import lightLogo from './assets/ryzen-logo-light.png'
import Versions from './components/Versions'
import * as ipc from './lib/ipc-client'

import RyzenValues from './components/RyzenValues'
import ThemeController from '/@renderer/components/control/ThemeController'
import Settings from '/@renderer/components/Settings'
import Status from '/@renderer/components/Status'
import { RyzenInfoContext, SettingsContext } from '/@renderer/lib/context'
import { setTheme } from '/@renderer/lib/theme'
import type { AppSettings } from '/@types/app-settings'
import type { RyzenInfo, RyzenInfoParams, RyzenInfoValue } from '/@types/ryzenadj/ryzenadj'

function App(): React.JSX.Element {
  const themeController = document.querySelector('.theme-controller') as HTMLInputElement

  const [currentRyzenInfo, setCurrentRyzenInfo] = useState<RyzenInfo>({})
  const [showSettings, setShowSettings] = useState<boolean>(false)
  const [settings, setSettings] = useState<Partial<AppSettings>>({})
  const appSettings = { settings, setSettings }

  window.api.onSettingsChange((settings) => {
    setSettings(settings)
    setTheme(themeController, settings)
  })

  const getRyzenInfo = async (): Promise<void> => {
    const newRyzenInfo = (await ipc.getRyzenInfo()).data ?? {}
    setCurrentRyzenInfo(newRyzenInfo)
    console.log(currentRyzenInfo)
  }

  const setRyzenParam = async (param: RyzenInfoParams, value: RyzenInfoValue): Promise<void> => {
    console.log(await window.api.setRyzenParam(param, value))
  }

  useEffect(() => {
    if (themeController) {
      setTheme(themeController, settings)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings])

  useEffect(() => {
    ipc
      .getSettings()
      .then(setSettings)
      .then(() => {
        if (themeController) {
          setTheme(themeController, settings)
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <SettingsContext.Provider value={appSettings}>
      <RyzenInfoContext.Provider value={currentRyzenInfo}>
        <div className="flex h-full flex-col">
          <div className="bg-base-200 flex flex-row items-center justify-around gap-2">
            <img alt="logo" className="logo hidden h-24 w-24 dark:block" src={darkLogo} />
            <img alt="logo" className="logo h-24 w-24 dark:hidden" src={lightLogo} />
            <h1 className="text-large md:text-3xl">Ryzen Control Center</h1>
            <Status className="ml-4 hidden sm:block" />
            <div className="grow" />
            <div className="flex flex-col">
              <button
                className="btn m-0 mr-2 h-8 w-8 border-none bg-transparent p-0"
                onClick={() => setShowSettings(!showSettings)}
              >
                {showSettings ? (
                  <XMarkIcon className="h-8 w-8" />
                ) : (
                  <Cog6ToothIcon className="h-8 w-8" />
                )}
              </button>
            </div>
          </div>
          {showSettings ? (
            <>
              <Settings />
              <div className="grow" />
              <Versions className="hidden! sm:flex!" />
            </>
          ) : (
            <>
              <div className="my-2 flex w-full flex-row flex-wrap justify-around gap-2">
                <a href="https://github.com/FlyGoat/RyzenAdj/wiki" target="_blank" rel="noreferrer">
                  <button className="btn">
                    Documentation <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                  </button>
                </a>
                <button className="btn btn-accent" onClick={getRyzenInfo}>
                  Get System Status
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setRyzenParam('power-saving', null)}
                >
                  Set power-saving
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setRyzenParam('max-performance', null)}
                >
                  Set max-performance
                </button>
              </div>
              <RyzenValues />
            </>
          )}
          <ThemeController />
        </div>
      </RyzenInfoContext.Provider>
    </SettingsContext.Provider>
  )
}

export default App
