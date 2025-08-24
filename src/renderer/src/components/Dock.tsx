import {
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  Square3Stack3DIcon
} from '@heroicons/react/16/solid'
import DockButton from '/@renderer/components/control/DockButton'
import { AppPage } from '/@types/ui/page'

function Dock({ page, setPage, setShowSettings }) {
  return (
    <div className="dock dock-md bg-base-200 relative min-h-16">
      <DockButton
        label="View"
        page={page}
        value={AppPage.VIEW}
        setShowSettings={setShowSettings}
        setPage={setPage}
      >
        <MagnifyingGlassIcon className="size-[1.2em]" />
      </DockButton>
      <DockButton
        label="Adjust"
        page={page}
        value={AppPage.ADJUST}
        setShowSettings={setShowSettings}
        setPage={setPage}
      >
        <AdjustmentsHorizontalIcon className="size-[1.2em]" />
      </DockButton>
      <DockButton
        label="Presets"
        page={page}
        value={AppPage.PRESETS}
        setShowSettings={setShowSettings}
        setPage={setPage}
      >
        <Square3Stack3DIcon className="size-[1.2em]" />
      </DockButton>
    </div>
  )
}

export default Dock
