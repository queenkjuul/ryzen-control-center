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
        <div className="btn flex h-min flex-row items-center justify-center border-none bg-transparent p-0">
          <InformationCircleIcon className={`text-base-content ${className}`} />
        </div>
      </div>
    </>
  )
}

export default InfoTooltip
