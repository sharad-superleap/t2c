export default function Alert({ type = 'error', message, onClose }) {
  if (!message) return null

  const styles = {
    error: 'border-red-500/30 bg-red-500/10 text-red-200',
    success: 'border-t2c-500/30 bg-t2c-500/10 text-t2c-200',
    info: 'border-blue-500/30 bg-blue-500/10 text-blue-200',
  }

  return (
    <div className={`relative rounded-xl border px-4 py-3 text-sm ${styles[type]}`} role="alert">
      {message}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-current opacity-60 hover:opacity-100"
          aria-label="Dismiss"
        >
          ×
        </button>
      )}
    </div>
  )
}
