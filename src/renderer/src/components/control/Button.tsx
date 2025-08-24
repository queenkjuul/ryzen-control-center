import type { PropsWithChildren } from 'react'

interface Props {
  className?: string
  label?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  disabled?: boolean
}

function Button({
  className = '',
  label = '',
  onClick = () => {},
  disabled = false,
  children
}: PropsWithChildren<Props>): React.JSX.Element {
  return (
    <button className={`btn ${className}`} onClick={onClick} disabled={disabled}>
      {label}
      {children}
    </button>
  )
}

export default Button
