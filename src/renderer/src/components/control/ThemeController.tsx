// The default DaisyUI approach is kind of weird, because it is pure CSS/Tailwind
// it requires there to be an input element (radio, checkbox) with a value set to the theme you want
// there is no other way to override the default theme
// The DaisyUI docs' example of a drop-down is not to my liking, so I'm just using a hidden control

function ThemeController(): React.JSX.Element {
  return (
    <input
      name="theme-dropdown"
      type="checkbox"
      className="theme-controller hidden"
      defaultChecked={false}
    />
  )
}

export default ThemeController
