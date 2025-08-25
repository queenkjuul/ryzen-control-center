import {
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  Square3Stack3DIcon
} from '@heroicons/react/16/solid'
import type { ReactElement } from 'react'
import DockButton from '/@renderer/components/control/DockButton'
import { AppPage } from '/@types/ui/page'

type Props = {
  page: AppPage
  setPage: React.Dispatch<React.SetStateAction<AppPage>>
  setShowSettings: React.Dispatch<React.SetStateAction<boolean>>
}

function Dock({ ...props }: Props): ReactElement {
  return (
    <div className="dock dock-md bg-base-200 relative min-h-16">
      <DockButton label="View" value={AppPage.VIEW} {...props}>
        <MagnifyingGlassIcon className="size-[1.2em]" />
      </DockButton>
      <DockButton label="Adjust" value={AppPage.ADJUST} {...props}>
        <AdjustmentsHorizontalIcon className="size-[1.2em]" />
      </DockButton>
      <DockButton label="Presets" value={AppPage.PRESETS} {...props}>
        <Square3Stack3DIcon className="size-[1.2em]" />
      </DockButton>
    </div>
  )
}

export default Dock
