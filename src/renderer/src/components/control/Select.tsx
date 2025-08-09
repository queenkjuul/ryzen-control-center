import type { ChangeEvent, EventHandler } from 'react'
import type { SelectOption } from '/@types/ui/select'

type Props = {
  label: string
  options: SelectOption[]
  onChange?: EventHandler<ChangeEvent<HTMLSelectElement>>
}
function Select({ label, options, onChange }: Props): React.JSX.Element {
  return (
    <label className="select">
      <span className="label">{label}</span>
      <select onChange={onChange}>
        {...options.map(({ value, label }) => (
          <>
            <option value={value} key={value}>
              {label}
            </option>
          </>
        ))}
      </select>
    </label>
  )
}

export default Select
