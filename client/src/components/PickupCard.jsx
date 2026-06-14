import { useEffect, useState } from 'react'
import { Trash2, MapPin, Calendar, Coins } from 'lucide-react'
import { PICKUP_STATUS } from '../utils/constants'
import { capitalize, canDeletePickup, deleteTimeRemaining, estimateCoins, formatDateTime } from '../utils/formatters'

export default function PickupCard({ pickup, onDelete, deleting }) {
  const [secondsLeft, setSecondsLeft] = useState(() => deleteTimeRemaining(pickup.createdAt))
  const deletable = canDeletePickup(pickup.createdAt)
  const status = PICKUP_STATUS[pickup.status] || PICKUP_STATUS.pending

  useEffect(() => {
    if (!deletable) return
    const interval = setInterval(() => {
      setSecondsLeft(deleteTimeRemaining(pickup.createdAt))
    }, 1000)
    return () => clearInterval(interval)
  }, [pickup.createdAt, deletable])

  const coins = estimateCoins(pickup.wasteTypes)

  return (
    <article className="glass overflow-hidden rounded-2xl">
      {pickup.imageUrls?.length > 0 && (
        <div className="flex gap-1 overflow-x-auto border-b border-white/10 p-2">
          {pickup.imageUrls.map((url, i) => (
            <img
              key={url}
              src={url}
              alt={`Pickup ${i + 1}`}
              className="h-24 w-32 shrink-0 rounded-lg object-cover"
            />
          ))}
        </div>
      )}

      <div className="p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${status.color}`}>
              {status.label}
            </span>
            <p className="mt-2 text-xs text-slate-500">
              ID: {pickup._id?.slice(-8)}
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-coin-500/10 px-3 py-1 text-sm font-semibold text-coin-400">
            <Coins className="h-4 w-4" />
            ~{coins} coins
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {pickup.wasteTypes?.map((type) => (
            <span
              key={type}
              className="rounded-lg bg-white/5 px-2.5 py-1 text-xs font-medium capitalize text-slate-300"
            >
              {capitalize(type)}
            </span>
          ))}
        </div>

        {pickup.address && (
          <div className="mb-3 flex items-start gap-2 text-sm text-slate-400">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-t2c-500" />
            <span>
              {pickup.address.street}, {pickup.address.city}, {pickup.address.state} — {pickup.address.pincode}
            </span>
          </div>
        )}

        <div className="mb-3 flex items-center gap-2 text-sm text-slate-400">
          <Calendar className="h-4 w-4 text-t2c-500" />
          {formatDateTime(pickup.createdAt || pickup.pickUpDate)}
        </div>

        {pickup.notes && (
          <p className="mb-4 rounded-lg bg-white/5 p-3 text-sm text-slate-400">
            {pickup.notes}
          </p>
        )}

        {pickup.aiAnalysis && (
          <div className="mb-4 rounded-xl border border-t2c-500/20 bg-t2c-500/5 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-t2c-400">
              AI Analysis
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-300">

              {pickup.aiAnalysis.wasteType && (
                <span>
                  🗂 Type: <strong className="capitalize">{pickup.aiAnalysis.wasteType}</strong>
                </span>
              )}

              {pickup.aiAnalysis.estimatedWeightKg && (
                <span>
                  ⚖️ Weight: <strong>~{pickup.aiAnalysis.estimatedWeightKg} kg</strong>
                </span>
              )}

              {pickup.aiAnalysis.confidence && (
                <span>
                  📊 Confidence: <strong className="capitalize">{pickup.aiAnalysis.confidence}</strong>
                </span>
              )}

              {pickup.aiAnalysis.isRecyclable !== undefined && (
                <span>
                  ♻️ Recyclable: <strong>{pickup.aiAnalysis.isRecyclable ? "Yes" : "No"}</strong>
                </span>
              )}

            </div>

            {pickup.aiAnalysis.description && (
              <p className="mt-2 text-xs text-slate-500 italic">
                "{pickup.aiAnalysis.description}"
              </p>
            )}
          </div>
        )}

        {deletable && secondsLeft > 0 && (
          <button
            type="button"
            onClick={() => onDelete(pickup._id)}
            disabled={deleting}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Cancel pickup ({Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')})
          </button>
        )}
      </div>
    </article>
  )
}
  