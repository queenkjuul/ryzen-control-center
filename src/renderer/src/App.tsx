import { ArrowTopRightOnSquareIcon, Cog6ToothIcon, XMarkIcon } from '@heroicons/react/16/solid'
import { useState } from 'react'
import darkLogo from './assets/ryzen-logo-dark.png'
import lightLogo from './assets/ryzen-logo-light.png'
import Versions from '/@components/Versions'
import * as ipc from '/@lib/ipc-client'

import ThemeController from '/@components/control/ThemeController'
import Dock from '/@components/Dock'
import RyzenValues from '/@components/RyzenValues'
import Settings from '/@components/Settings'
import Status from '/@components/Status'
import { RyzenInfoContext, SettingsContext } from '/@lib/context'
import { setTheme } from '/@lib/theme/theme'
import type { AppSettings } from '/@types/app-settings'
import type { RyzenInfo, RyzenInfoParams, RyzenInfoValue } from '/@types/ryzenadj/ryzenadj'
import { AppPage } from '/@types/ui/page'

function App(): React.JSX.Element {
  const themeController = document.querySelector('.theme-controller') as HTMLInputElement

  const [page, setPage] = useState<AppPage>(AppPage.VIEW)
  const [currentRyzenInfo, setCurrentRyzenInfo] = useState<RyzenInfo>({})
  const [showSettings, setShowSettings] = useState<boolean>(false)
  const [settings, setSettings] = useState<Partial<AppSettings>>({})
  const appSettings = { settings, setSettings }

  window.api.onSettingsChange((settings) => {
    setSettings(settings)
    setTheme(themeController, settings)
  })

  const getRyzenInfo = async (): Promise<void> => {
    const newRyzenInfo = await ipc.getRyzenInfo()
    setCurrentRyzenInfo(newRyzenInfo)
    console.log(currentRyzenInfo)
  }

  const setRyzenParam = async (param: RyzenInfoParams, value: RyzenInfoValue): Promise<void> => {
    const data = await ipc.setRyzenParam(param, value)
    if (!data.setResult) {
      throw new Error(`Failed to set parameter: ${param} to ${value}`)
    }
    setCurrentRyzenInfo(data.newInfo)
    console.log(data.newInfo)
  }

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
              {page === AppPage.VIEW ? (
                <RyzenValues />
              ) : page === AppPage.ADJUST ? (
                <div className="grow">Adjust View</div>
              ) : (
                <div className="grow">PresetsView</div>
              )}
              <Dock page={page} setPage={setPage} />
            </>
          )}
          <ThemeController />
        </div>
      </RyzenInfoContext.Provider>
    </SettingsContext.Provider>
  )
}

export default App
