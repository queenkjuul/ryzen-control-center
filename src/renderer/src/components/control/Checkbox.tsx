import type { ChangeEventHandler } from 'react'

type Props = {
  label?: string
  className?: string
  disabled?: boolean
  defaultChecked?: boolean
  value?: any
  onChange?: ChangeEventHandler<HTMLInputElement>
}

function Checkbox({
  label = '',
  className = '',
  disabled = false,
  defaultChecked = false,
  value,
  onChange
}: Props): React.JSX.Element {
  return (
    <label className={`label text-base-content`}>
      <input
        type="checkbox"
        className={`checkbox checkbox-primary ${className}`}
        disabled={disabled}
        defaultChecked={defaultChecked}
        value={value}
        onChange={onChange}
      />
      {label}
    </label>
  )
}

export default Checkbox
