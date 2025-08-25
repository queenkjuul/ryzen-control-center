import type { ChangeEvent, EventHandler, ReactElement } from 'react'
import type { SelectOption } from '/@types/ui/select'

type Props = {
  className?: string
  label: string
  options: SelectOption[]
  disabled?: boolean
  value?: any
  onChange?: EventHandler<ChangeEvent<HTMLSelectElement>>
}
function Select({
  className = '',
  label,
  options,
  value,
  disabled = false,
  onChange
}: Props): ReactElement {
  return (
    <label className={`select ${className}`}>
      <span className="label">{label}</span>
      <select
        className="[&_option:hover]:bg-accent!"
        onChange={onChange}
        disabled={disabled}
        value={value}
      >
        {...options.map(({ value, label }) => (
          <>
            <option
              className="hover:bg-emerald-700! focus:bg-emerald-800!"
              value={value}
              key={value}
            >
              {label}
            </option>
          </>
        ))}
      </select>
    </label>
  )
}

export default Select
