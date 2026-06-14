import { WASTE_TYPES } from '../utils/constants'

export default function WasteTypeSelector({ selected, onChange }) {
  const toggle = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter((t) => t !== id))
    } else {
      onChange([...selected, id])
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {WASTE_TYPES.map((type) => {
        const isSelected = selected.includes(type.id)
        return (
          <button
            key={type.id}
            type="button"
            onClick={() => toggle(type.id)}
            className={`relative rounded-xl border p-4 text-left transition-all ${
              isSelected
                ? 'border-t2c-500 bg-t2c-500/15 ring-1 ring-t2c-500/50'
                : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
            }`}
          >
            <span className="text-2xl">{type.icon}</span>
            <p className="mt-2 text-sm font-semibold text-white">{type.label}</p>
            <p className="mt-0.5 text-xs text-coin-400">~{type.coins} coins</p>
            {isSelected && (
              <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-t2c-500 text-xs text-white">
                ✓
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
