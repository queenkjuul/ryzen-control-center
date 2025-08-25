import { ArrowPathIcon } from '@heroicons/react/16/solid'
import {
  BookOpenIcon,
  Cog6ToothIcon,
  RocketLaunchIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useContext, useEffect, useRef, useState, type ReactElement } from 'react'
import darkLogo from '../assets/ryzen-logo-dark.png'
import lightLogo from '../assets/ryzen-logo-light.png'
import Status from '/@renderer/components/Status'
import LeafIcon from '/@renderer/components/control/LeafIcon'
import { RyzenInfoContext } from '/@renderer/lib/context'

type Props = {
  showSettings: boolean
  setShowSettings: (boolean) => any
}

function Header({ showSettings, setShowSettings }: Props): ReactElement {
  const { ryzenInfo, getRyzenInfo, setRyzenParam } = useContext(RyzenInfoContext)

  const [init, setInit] = useState<boolean>(false)
  const powerToggleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (powerToggleRef.current && !init) {
      powerToggleRef.current.indeterminate = true
      setInit(true)
      return
    } else if (powerToggleRef.current && init) {
      powerToggleRef.current.indeterminate = false
      return
    }
  }, [powerToggleRef, ryzenInfo])

  return (
    <div className="bg-base-200 flex flex-row items-center justify-around gap-1">
      <img alt="logo" className="logo hidden h-24 w-24 dark:block" src={darkLogo} />
      <img alt="logo" className="logo h-24 w-24 dark:hidden" src={lightLogo} />
      <h1 className="text-large mr-auto md:text-3xl">Ryzen Control Center</h1>
      <Status className="mr-2 hidden sm:block" />
      <div className="mr-2 flex h-full flex-col justify-center gap-2">
        <div className="mt-1 flex w-full flex-row justify-between">
          <button
            className="tooltip text-primary tooltip-left btn m-0 h-6 w-6 border-none bg-transparent p-0"
            data-tip="Fetch Ryzen Info (Requires Admin)"
            onClick={() => getRyzenInfo()}
          >
            <ArrowPathIcon className="w-6" />
          </button>
          <a
            className="tooltip tooltip-left btn m-0 h-6 w-6 border-none bg-transparent p-0"
            href="https://github.com/FlyGoat/RyzenAdj/wiki"
            data-tip="Open RyzenAdj Documentation in Browser"
            target="_blank"
            rel="noreferrer"
          >
            <BookOpenIcon className="w-6" />
          </a>
          <button
            className="tooltip tooltip-left btn m-0 h-6 w-6 border-none bg-transparent p-0"
            data-tip={showSettings ? 'Close App Settings' : 'Show App Settings'}
            onClick={() => setShowSettings(!showSettings)}
          >
            {showSettings ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Cog6ToothIcon className="h-6 w-6" />
            )}
          </button>
        </div>
        <fieldset className="fieldset flex flex-row items-center">
          <label
            htmlFor="power-toggle"
            className="label tooltip tooltip-left grid grid-flow-col font-bold"
            data-tip="Toggle between Power Saving and Max Performance (Needs Admin Password)"
          >
            <input
              id="power-toggle"
              name="power-toggle"
              type="checkbox"
              className="peer toggle toggle-primary border-primary text-primary"
              ref={powerToggleRef}
              checked={ryzenInfo.POWER_SAVING?.value === 'max-performance'}
              onChange={(e) => {
                setRyzenParam(e.target.checked ? 'max-performance' : 'power-saving', null)
              }}
            />
            <span className="text-base-content peer-checked:fieldset-label col-start-1">
              <LeafIcon className="w-6" />
            </span>
            <span className="peer-checked:text-base-content">
              <RocketLaunchIcon className="w-6" />
            </span>
          </label>
        </fieldset>
      </div>
    </div>
  )
}

export default Header
