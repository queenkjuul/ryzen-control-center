import type { ReactElement } from 'react'
import Button from '/@renderer/components/control/Button'
import Select from '/@renderer/components/control/Select'

function ThemePreview(): ReactElement {
  return (
    <fieldset className="fieldset bg-base-200 border-base-300 rounded border p-2">
      <legend className="fieldset-legend">Theme Preview</legend>
      <label className="label">
        <input type="checkbox" className="toggle" />
        {'Toggle!'}
      </label>
      <Select
        className="select-accent w-full"
        label="Select"
        options={[
          { value: 'option', label: 'Option' },
          { value: 'option', label: 'Option' }
        ]}
      />
      <Button className="btn-primary">
        <>Click Me!</>
      </Button>
      <Button className="btn-secondary">
        <>Click Me!</>
      </Button>
    </fieldset>
  )
}

export default ThemePreview
