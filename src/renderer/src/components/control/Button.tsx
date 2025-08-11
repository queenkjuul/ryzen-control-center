function Button({ className = '', label = '', onClick = () => {}, children }) {
  return (
    <button className={`btn ${className}`} onClick={onClick}>
      {label}
      {children}
    </button>
  )
}

export default Button
