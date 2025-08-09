type Props = {
  label: string
  defaultChecked?: boolean
}

function Checkbox({ label, defaultChecked = false }: Props): React.JSX.Element {
  return (
    <label className="label">
      <input type="checkbox" defaultChecked={defaultChecked} className="checkbox" />
      {label}
    </label>
  )
}

export default Checkbox
