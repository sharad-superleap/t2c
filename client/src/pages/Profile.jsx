import { useState } from 'react'
import { Save, User, MapPin } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { updateUser } from '../api/auth'
import Alert from '../components/Alert'
import LoadingSpinner from '../components/LoadingSpinner'
import { INDIAN_STATES } from '../utils/constants'

export default function Profile() {
  const { user, updateLocalUser } = useAuth()

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    email: user?.email || '',
    password: '',
    address: {
      pincode: user?.address?.pincode || '',
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      country: user?.address?.country || 'India',
    },
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const updateAddress = (field, value) => {
    setForm((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    const payload = { ...form }
    if (!payload.password) delete payload.password

    try {
      const data = await updateUser(payload)
      updateLocalUser(data.user)
      setSuccess('Profile updated successfully!')
      setForm((prev) => ({ ...prev, password: '' }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-t2c-500 focus:outline-none focus:ring-1 focus:ring-t2c-500'

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-400">
          <User className="h-3.5 w-3.5" />
          Account
        </div>
        <h1 className="font-display text-3xl font-bold">Your Profile</h1>
        <p className="mt-2 text-slate-400">
          Update your details and pickup address.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass space-y-6 rounded-2xl p-6 sm:p-8">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">First name</label>
            <input
              value={form.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Last name</label>
            <input
              value={form.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            New password <span className="text-slate-500">(leave blank to keep current)</span>
          </label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => updateField('password', e.target.value)}
            className={inputClass}
            placeholder="••••••••"
          />
        </div>

        <div className="border-t border-white/10 pt-6">
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-t2c-400" />
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-400">
              Pickup Address
            </h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Street</label>
              <input
                value={form.address.street}
                onChange={(e) => updateAddress('street', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">City</label>
              <input
                value={form.address.city}
                onChange={(e) => updateAddress('city', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">State</label>
              <select
                value={form.address.state}
                onChange={(e) => updateAddress('state', e.target.value)}
                className={inputClass}
              >
                <option value="" className="bg-slate-900">Select state</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state} className="bg-slate-900">
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Pincode</label>
              <input
                maxLength={6}
                value={form.address.pincode}
                onChange={(e) => updateAddress('pincode', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Country</label>
              <input
                value={form.address.country}
                onChange={(e) => updateAddress('country', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-t2c-500 to-emerald-600 py-3 font-semibold text-white transition hover:from-t2c-400 hover:to-emerald-500 disabled:opacity-60"
        >
          {loading ? <LoadingSpinner size="sm" /> : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </button>
      </form>
    </div>
  )
}
