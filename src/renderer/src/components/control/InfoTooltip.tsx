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
        className={`tooltip relative${!tooltip ? ' hidden' : ''}${direction ? ` tooltip-${direction}` : ''}`}
        data-tip={tooltip}
      >
        <button className="btn p-0 h-min flex flex-row items-center justify-center bg-transparent">
          <InformationCircleIcon className={`text-base-content ${className}`} />
        </button>
      </div>
    </>
  )
}

export default InfoTooltip
