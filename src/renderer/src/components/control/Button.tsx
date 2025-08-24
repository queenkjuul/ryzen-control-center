import type { PropsWithChildren, ReactElement } from 'react'

interface Props {
  className?: string
  label?: string
  tooltip?: string
  disabled?: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

function Button({
  className = '',
  label = '',
  tooltip = '',
  disabled = false,
  onClick = () => {},
  children
}: PropsWithChildren<Props>): ReactElement {
  return (
    <button
      className={`btn tooltip ${className}`}
      onClick={onClick}
      disabled={disabled}
      data-tip={tooltip}
    >
      {label}
      {children}
    </button>
  )
}

export default Button
