import cn from '@meltdownjs/cn'
import { useEffect, useState, type ReactElement } from 'react'
import ThemeController from '/@components/control/ThemeController'
import Dock from '/@components/Dock'
import RyzenValues from '/@components/RyzenValues'
import Settings from '/@components/Settings'
import Versions from '/@components/Versions'
import { RyzenInfoContext, SettingsContext } from '/@lib/context'
import * as ipc from '/@lib/ipc-client'
import { setTheme } from '/@lib/theme/theme'
import GetInfoPrompt from '/@renderer/components/GetInfoPrompt'
import Header from '/@renderer/components/Header'
import RyzenAdjust from '/@renderer/components/RyzenAdjust'
import RyzenPresets from '/@renderer/components/RyzenPresets'
import { populated } from '/@renderer/lib/util'
import type { AppSettings } from '/@types/app-settings'
import type { RyzenInfo, RyzenInfoParams, RyzenInfoValue } from '/@types/ryzenadj'
import { AppPage } from '/@types/ui/page'

function App(): ReactElement {
  const themeController = document.querySelector('.theme-controller') as HTMLInputElement

  const [page, setPage] = useState<AppPage>(AppPage.VIEW)
  const [ryzenInfo, setRyzenInfo] = useState<RyzenInfo>({})
  const [haveData, setHaveData] = useState<boolean>(populated(ryzenInfo))
  const [showSettings, setShowSettings] = useState<boolean>(false)
  const [settings, setSettings] = useState<Partial<AppSettings>>({})
  const appSettings = { settings, setSettings }

  useEffect(() => {
    setHaveData(populated(ryzenInfo))
  }, [ryzenInfo])

  window.api.onSettingsChange((settings) => {
    setSettings(settings)
    setTheme(themeController, settings)
  })

  const getRyzenInfo = async (): Promise<void> => {
    const newRyzenInfo = await ipc.getRyzenInfo()
    setRyzenInfo(newRyzenInfo)
  }

  return (
    <SettingsContext.Provider value={appSettings}>
      <RyzenInfoContext.Provider value={{ ryzenInfo, setRyzenInfo, getRyzenInfo }}>
        <div className="flex h-full flex-col">
          <Header
            showSettings={showSettings}
            setShowSettings={setShowSettings}
            getRyzenInfo={getRyzenInfo}
          />
          {showSettings ? (
            <>
              <Settings />
              <div className="grow" />
              <Versions className="hidden! sm:flex!" />
            </>
          ) : (
            <>
              {!haveData ? (
                <GetInfoPrompt className={cn('grow', { 'z-10': !haveData })} />
              ) : page === AppPage.VIEW ? (
                <RyzenValues />
              ) : page === AppPage.ADJUST ? (
                <RyzenAdjust />
              ) : (
                <RyzenPresets />
              )}
            </>
          )}
          <Dock page={page} setPage={setPage} setShowSettings={setShowSettings} />
          <ThemeController />
        </div>
      </RyzenInfoContext.Provider>
    </SettingsContext.Provider>
  )
}

export default App
