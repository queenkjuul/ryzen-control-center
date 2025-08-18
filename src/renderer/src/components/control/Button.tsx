import type { PropsWithChildren } from 'react'

interface Props {
  className?: string
  label?: string
  onClick?: () => any
}

function Button({
  className = '',
  label = '',
  onClick = () => {},
  children
}: PropsWithChildren<Props>): React.JSX.Element {
  return (
    <button className={`btn ${className}`} onClick={onClick}>
      {label}
      {children}
    </button>
  )
}

export default Button
