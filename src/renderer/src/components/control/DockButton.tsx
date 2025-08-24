function DockButton({ page, setPage, setShowSettings, value, label, children }) {
  return (
    <button
      className={page === value ? 'dock-active' : ''}
      onClick={() => {
        setShowSettings(false)
        setPage(value)
      }}
    >
      {children}
      <span className="dock-label">{label}</span>
    </button>
  )
}

export default DockButton
