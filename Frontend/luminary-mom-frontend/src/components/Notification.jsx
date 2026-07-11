const styles = {
  info: { icon: '💛', accent: 'bg-[#F3E7A5] border-[#DDCF82]' },
  success: { icon: '🌸', accent: 'bg-[#D9E7D2] border-[#B8CDAE]' },
  removed: { icon: '🕊️', accent: 'bg-[#EAD4D0] border-[#D5AEA8]' },
  warning: { icon: '🌿', accent: 'bg-[#F3E7A5] border-[#DDCF82]' },
  error: { icon: '🌧️', accent: 'bg-[#F3E7A5] border-[#DDCF82]' },
}

function Notification({ notification, onDismiss }) {
  if (!notification) return null

  const { type = 'info', title, message, action } = notification
  const { icon, accent } = styles[type] ?? styles.info

  return (
    <div className="notification-slide-in fixed top-20 right-5 z-[60] w-[calc(100%-2.5rem)] max-w-sm" aria-live="polite" role="status">
      <div className={`${accent} rounded-sm border px-5 py-4 shadow-lg flex gap-3`}>
        <span className="pt-0.5" aria-hidden="true">{icon}</span>
        <div className="min-w-0 flex-1">
          {title && <p className="font-serif text-lg italic text-text-dark">{title}</p>}
          <p className="text-sm text-text-mid leading-relaxed">{message}</p>
          {action && (
            <a href={action.href} className="inline-block mt-2 text-xs uppercase tracking-widest text-text-dark border-b border-text-mid hover:border-text-dark transition-colors">
              {action.label}
            </a>
          )}
        </div>
        <button onClick={onDismiss} className="text-text-light hover:text-text-dark bg-transparent border-none cursor-pointer p-0 text-lg leading-none" aria-label="Dismiss notification">
          ×
        </button>
      </div>
    </div>
  )
}

export default Notification
