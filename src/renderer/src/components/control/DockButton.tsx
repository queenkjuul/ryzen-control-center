import type { PropsWithChildren, ReactElement } from 'react'
import type { AppPage } from '/@types/ui/page'

type Props = {
  page: AppPage
  setPage: React.Dispatch<React.SetStateAction<AppPage>>
  setShowSettings: React.Dispatch<React.SetStateAction<boolean>>
  value: AppPage
  label: string
} & PropsWithChildren

function DockButton({
  page,
  setPage,
  setShowSettings,
  value,
  label,
  children
}: Props): ReactElement {
  return (
    <button
      className={page === value ? 'dock-active' : ''}
      onClick={() => {
        setShowSettings(false)
        setPage(value)
      }}
    >
      {children}
      <span className="dock-label">{label}</span>
    </button>
  )
}

export default DockButton
