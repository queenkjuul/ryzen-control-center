import { ArrowPathIcon } from '@heroicons/react/16/solid'
import { BookOpenIcon, Cog6ToothIcon, XMarkIcon } from '@heroicons/react/24/outline'
import type { ReactElement } from 'react'
import darkLogo from '../assets/ryzen-logo-dark.png'
import lightLogo from '../assets/ryzen-logo-light.png'
import Status from '/@renderer/components/Status'

type Props = {
  showSettings: boolean
  setShowSettings: (boolean) => any
  getRyzenInfo: () => any
}

function Header({ showSettings, setShowSettings, getRyzenInfo }: Props): ReactElement {
  return (
    <div className="bg-base-200 flex flex-row items-center justify-around gap-2">
      <img alt="logo" className="logo hidden h-24 w-24 dark:block" src={darkLogo} />
      <img alt="logo" className="logo h-24 w-24 dark:hidden" src={lightLogo} />
      <h1 className="text-large md:text-3xl">Ryzen Control Center</h1>
      <Status className="ml-4 hidden sm:block" />
      <div className="flex flex-row justify-around">
        <button
          className="tooltip text-accent tooltip-left btn m-0 mr-2 h-6 w-6 border-none bg-transparent p-0"
          data-tip="Fetch Ryzen Info (Requires Admin)"
          onClick={() => getRyzenInfo()}
        >
          <ArrowPathIcon className="w-6" />
        </button>
        <a
          className="tooltip tooltip-left btn m-0 mr-2 h-6 w-6 border-none bg-transparent p-0"
          href="https://github.com/FlyGoat/RyzenAdj/wiki"
          data-tip="Open RyzenAdj Documentation in Browser"
          target="_blank"
          rel="noreferrer"
        >
          <BookOpenIcon className="w-6" />
        </a>
        <button
          className="tooltip tooltip-left btn m-0 mr-2 h-6 w-6 border-none bg-transparent p-0"
          data-tip={showSettings ? 'Close App Settings' : 'Show App Settings'}
          onClick={() => setShowSettings(!showSettings)}
        >
          {showSettings ? <XMarkIcon className="h-6 w-6" /> : <Cog6ToothIcon className="h-6 w-6" />}
        </button>
      </div>
    </div>
  )
}

export default Header
