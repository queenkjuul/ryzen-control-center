import { Cog6ToothIcon, XMarkIcon } from '@heroicons/react/16/solid'
import { useEffect, useState } from 'react'
import darkLogo from './assets/ryzen-logo-dark.png'
import lightLogo from './assets/ryzen-logo-light.png'
import Versions from './components/Versions'
import * as ipc from '/@lib/ipc'

import Settings from '/@renderer/components/Settings'
import Status from '/@renderer/components/Status'
import type { RyzenInfo, RyzenInfoParams, RyzenInfoValue } from '/@types/ryzenadj/ryzenadj'
import { Themes } from '/@types/themes'

function App(): React.JSX.Element {
  const [currentRyzenInfo, setCurrentRyzenInfo] = useState<RyzenInfo>()
  const [showSettings, setShowSettings] = useState<boolean>(false)

  const getRyzenInfo = async (): Promise<void> => {
    const newRyzenInfo = (await ipc.getRyzenInfo()).data
    setCurrentRyzenInfo(newRyzenInfo)
    console.log(currentRyzenInfo)
  }

  const setRyzenParam = async (param: RyzenInfoParams, value: RyzenInfoValue): Promise<void> => {
    console.log(await window.api.setRyzenParam(param, value))
  }
  window.api.onHighContrast((value) => {
    console.log('highContrast changed to ', value)
  })

  useEffect(() => {})

  return (
    <div>
      <div className="flex flex-row gap-2 items-center justify-around bg-base-200">
        <img alt="logo" className="logo h-24 w-24 hidden dark:block" src={darkLogo} />
        <img alt="logo" className="logo h-24 w-24 dark:hidden" src={lightLogo} />
        <h1 className="text-3xl">Ryzen Control Center</h1>
        <div className="grow" />
        <Status
          cpuFam={currentRyzenInfo?.CPU_FAMILY?.value}
          powerSave={currentRyzenInfo?.POWER_SAVING?.value}
        />
        <div className="grow" />
        <div className="flex flex-col h-full items-end">
          <button
            className="btn w-8 h-8 bg-transparent border-none p-0 m-0 mr-2"
            onClick={() => setShowSettings(!showSettings)}
          >
            {showSettings ? (
              <XMarkIcon className="w-8 h-8" />
            ) : (
              <Cog6ToothIcon className="w-8 h-8" />
            )}
          </button>
        </div>
      </div>
      {showSettings ? (
        <Settings />
      ) : (
        <>
          <div className="my-2 flex flex-row flex-wrap w-full gap-2 justify-around">
            <button className="btn">
              <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
                Documentation
              </a>
            </button>
            <button className="btn">
              <a target="_blank" rel="noreferrer" onClick={() => {}}>
                Toggle Dark/Light Mode
              </a>
            </button>
            <button className="btn btn-accent">
              <a target="_blank" rel="noreferrer" onClick={getRyzenInfo}>
                Get RyzenInfo
              </a>
            </button>
            <button className="btn btn-secondary">
              <a
                target="_blank"
                rel="noreferrer"
                onClick={() => setRyzenParam('power-saving', null)}
              >
                Set power-saving
              </a>
            </button>
            <button className="btn btn-primary">
              <a
                target="_blank"
                rel="noreferrer"
                onClick={() => setRyzenParam('max-performance', null)}
              >
                Set max-performance
              </a>
            </button>
            <button
              className="btn btn-accent"
              onClick={() => {
                const themeToSet = window.api?.nativeTheme?.shouldUseDarkColors
                  ? Themes['amd-dark-hic']
                  : Themes['amd-light-hic']
                console.log(window.api)
                document.querySelector('html')?.setAttribute('data-theme', themeToSet)
              }}
            >
              Set High Contrast Theme
            </button>
          </div>
        </>
      )}
      <Versions></Versions>
    </div>
  )
}

export default App
