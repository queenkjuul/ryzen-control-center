import { InformationCircleIcon } from '@heroicons/react/16/solid'

interface Props {
  tooltip: string
  direction?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

function InfoTooltip({ tooltip, direction, className = '' }: Props): React.JSX.Element {
  return (
    <>
      <div
        className={`tooltip relative ${!tooltip ? 'hidden' : ''}${direction ? ` tooltip-${direction}` : ''}`}
        data-tip={tooltip}
      >
        <button className="btn flex h-min flex-row items-center justify-center bg-transparent p-0">
          <InformationCircleIcon className={`text-base-content ${className}`} />
        </button>
      </div>
    </>
  )
}

export default InfoTooltip
