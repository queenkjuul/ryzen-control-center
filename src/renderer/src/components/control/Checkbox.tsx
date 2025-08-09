import type { ChangeEventHandler } from 'react'

type Props = {
  label: string
  defaultChecked?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
}

function Checkbox({ label, defaultChecked = false, onChange }: Props): React.JSX.Element {
  return (
    <label className="label">
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="checkbox"
        onChange={onChange}
      />
      {label}
    </label>
  )
}

export default Checkbox
