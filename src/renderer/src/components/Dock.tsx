import {
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  Square3Stack3DIcon
} from '@heroicons/react/16/solid'
import DockButton from '/@renderer/components/control/DockButton'
import { AppPage } from '/@types/ui/page'

function Dock({ page, setPage }) {
  return (
    <div className="dock dock-md relative min-h-16">
      <DockButton label="View" page={page} value={AppPage.VIEW} setPage={setPage}>
        <MagnifyingGlassIcon className="size-[1.2em]" />
      </DockButton>
      <DockButton label="Adjust" page={page} value={AppPage.ADJUST} setPage={setPage}>
        <AdjustmentsHorizontalIcon className="size-[1.2em]" />
      </DockButton>
      <DockButton label="Presets" page={page} value={AppPage.PRESETS} setPage={setPage}>
        <Square3Stack3DIcon className="size-[1.2em]" />
      </DockButton>
    </div>
  )
}

export default Dock
