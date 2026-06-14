import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Bell, Camera, Coins, MapPin, Upload, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { createPickup } from '../api/pickups'
import WasteTypeSelector from '../components/WasteTypeSelector'
import Alert from '../components/Alert'
import LoadingSpinner from '../components/LoadingSpinner'
import { estimateCoins } from '../utils/formatters'

export default function SchedulePickup() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [wasteTypes, setWasteTypes] = useState([])
  const [notes, setNotes] = useState('')
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length + images.length > 3) {
      setError('Maximum 3 images allowed')
      return
    }

    const newImages = [...images, ...files].slice(0, 3)
    setImages(newImages)

    previews.forEach((url) => URL.revokeObjectURL(url))
    setPreviews(newImages.map((f) => URL.createObjectURL(f)))
    setError('')
  }

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index])
    setImages((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (wasteTypes.length === 0) {
      setError('Please select at least one waste type')
      return
    }

    setLoading(true)
    try {
      await createPickup({ wasteTypes, notes, images })
      navigate('/history', { state: { success: 'Pickup scheduled successfully! An inspector will be assigned soon.' } })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const estimatedCoins = estimateCoins(wasteTypes)

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-t2c-500/30 bg-t2c-500/10 px-3 py-1 text-xs font-medium text-t2c-300">
          <Bell className="h-3.5 w-3.5" />
          Doorstep Pickup
        </div>
        <h1 className="font-display text-3xl font-bold">Schedule Pickup</h1>
        <p className="mt-2 text-slate-400">
          Select waste types, upload photos, and we&apos;ll send an inspector to your doorstep.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {/* Address from profile */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-t2c-400" />
            <div>
              <h3 className="font-semibold text-white">Pickup Address</h3>
              <p className="mt-1 text-sm text-slate-400">
                {user?.address?.street}, {user?.address?.city}, {user?.address?.state} — {user?.address?.pincode}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Update it in{' '}
                <Link to="/profile" className="text-t2c-400 hover:underline">Profile</Link>.
              </p>
            </div>
          </div>
        </div>

        {/* Waste types */}
        <div>
          <h3 className="mb-4 font-display text-lg font-semibold">Select Waste Categories</h3>
          <WasteTypeSelector selected={wasteTypes} onChange={setWasteTypes} />
          {wasteTypes.length > 0 && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-coin-500/30 bg-coin-500/10 px-4 py-3 text-sm">
              <Coins className="h-5 w-5 text-coin-400" />
              <span className="text-coin-300">
                Estimated reward: <strong>~{estimatedCoins} TrashCoins</strong> (final amount after verification)
              </span>
            </div>
          )}
        </div>

        {/* Images */}
        <div>
          <h3 className="mb-4 font-display text-lg font-semibold">Upload Trash Photos</h3>
          <p className="mb-4 text-sm text-slate-400">
            AI will analyze your photos to estimate weight and verify waste type. Max 3 images.
          </p>

          <div className="flex flex-wrap gap-3">
            {previews.map((url, i) => (
              <div key={url} className="relative">
                <img src={url} alt={`Preview ${i + 1}`} className="h-24 w-24 rounded-xl object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow"
                  aria-label="Remove image"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            {images.length < 3 && (
              <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 bg-white/5 transition hover:border-t2c-500/50 hover:bg-white/10">
                <Camera className="h-6 w-6 text-slate-500" />
                <span className="mt-1 text-[10px] text-slate-500">Add photo</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="mb-2 block font-display text-lg font-semibold">
            Notes for Inspector (optional)
          </label>
          <textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-t2c-500 focus:outline-none focus:ring-1 focus:ring-t2c-500"
            placeholder="e.g. Please ring doorbell, waste is in blue bag near gate..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-t2c-500 to-emerald-600 py-4 font-semibold text-white shadow-lg shadow-t2c-500/25 transition hover:from-t2c-400 hover:to-emerald-500 disabled:opacity-60"
        >
          {loading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              <Upload className="h-5 w-5" />
              Submit Pickup Request
            </>
          )}
        </button>
      </form>
    </div>
  )
}
