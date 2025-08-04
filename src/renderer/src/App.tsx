import { useEffect, useState } from 'react'
import darkLogo from './assets/ryzen-logo-dark.png'
import lightLogo from './assets/ryzen-logo-light.png'
import Versions from './components/Versions'
import type { RyzenInfo, RyzenInfoParams, RyzenInfoValue } from '/@types/ryzenadj/ryzenadj'
import { Themes } from '/@types/themes'

let currentRyzenInfo: RyzenInfo

function App(): React.JSX.Element {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>()
  const [_highContrast, setHighContrast] = useState<'hiC' | 'normal'>()
  const [theme, setTheme] = useState<Themes>()

  useEffect(() => {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
      const newColorScheme = event.matches ? 'dark' : 'light'
      setColorScheme(newColorScheme)
    })
  }, [])

  useEffect(() => {
    window.matchMedia('(prefers-contrast: more)').addEventListener('change', (event) => {
      const newHiCMode = event.matches ? 'hiC' : 'normal'
      setHighContrast(newHiCMode)
      if (!theme && newHiCMode === 'hiC') {
        setTheme(
          window.api.nativeTheme.shouldUseDarkColors.valueOf()
            ? Themes['amd-dark-hic']
            : Themes['amd-light-hic']
        )
      }
    })
  })

  const ipcHandle = (): void => window.api.ping()
  const getRyzenInfo = async (): Promise<void> => {
    currentRyzenInfo = await window.api.getRyzenInfo()
    console.log(currentRyzenInfo)
  }

  const setRyzenParam = async (param: RyzenInfoParams, value: RyzenInfoValue): Promise<void> => {
    console.log(await window.api.setRyzenParam(param, value))
  }

  return (
    <div>
      <div className="flex flex-row gap-2 items-center bg-base-200">
        <img
          alt="logo"
          className="logo h-24 w-24"
          src={colorScheme === 'light' ? lightLogo : darkLogo}
        />
        <h1 className="text-3xl">Ryzen Control Center</h1>
      </div>
      <div className="w-full text-center">Powered by electron-vite</div>
      <div className="w-full text-center">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <div className="flex flex-row flex-wrap w-full gap-2 justify-around">
        <button className="btn">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </button>
        <button className="btn">
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
            Toggle Dark/Light Mode
          </a>
        </button>
        <button className="btn btn-accent">
          <a target="_blank" rel="noreferrer" onClick={getRyzenInfo}>
            Get RyzenInfo
          </a>
        </button>
        <button className="btn btn-secondary">
          <a target="_blank" rel="noreferrer" onClick={() => setRyzenParam('power-saving', null)}>
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
      </div>
      <Versions></Versions>
    </div>
  )
}

export default App
