function DockButton({ page, setPage, value, label, children }) {
  return (
    <button className={page === value ? 'dock-active' : ''} onClick={() => setPage(value)}>
      {children}
      <span className="dock-label">{label}</span>
    </button>
  )
}

export default DockButton
