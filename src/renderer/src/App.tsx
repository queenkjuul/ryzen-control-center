import electronLogo from './assets/electron.svg'
import Versions from './components/Versions'
import { RyzenInfoParams, RyzenInfoValue } from '/@types/ryzenadj'

function App(): React.JSX.Element {
  const ipcHandle = (): void => window.api.ping()
  const getRyzenInfo = async (): Promise<void> => {
    console.log(await window.api.getRyzenInfo())
  }
  const setRyzenParam = async (param: RyzenInfoParams, value: RyzenInfoValue): Promise<void> => {
    console.log(await window.api.setRyzenParam(param, value))
  }

  return (
    <>
      <img alt="logo" className="logo h-24 w-24" src={electronLogo} />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="flex flex-row w-full gap-2 justify-around">
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
    </>
  )
}

export default App
