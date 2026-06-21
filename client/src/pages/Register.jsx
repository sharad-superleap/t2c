import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Alert from '../components/Alert'
import LoadingSpinner from '../components/LoadingSpinner'
import { INDIAN_STATES } from '../utils/constants'

const emptyAddress = { pincode: '', street: '', city: '', state: '', country: 'India' }

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    address: { ...emptyAddress },
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

    try {
      await register(form)
      setSuccess('Account created! Redirecting to login...')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-t2c-500 focus:outline-none focus:ring-1 focus:ring-t2c-500'

  return (
    <div className="px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-t2c-500/20">
            <UserPlus className="h-7 w-7 text-t2c-400" />
          </div>
          <h1 className="font-display text-2xl font-bold">Join Trash2Cash</h1>
          <p className="mt-2 text-sm text-slate-400">
            Create your account and start turning waste into rewards
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass space-y-6 rounded-2xl p-6 sm:p-8">
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}
          {success && <Alert type="success" message={success} />}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">First name</label>
              <input
                required
                minLength={2}
                value={form.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                className={inputClass}
                placeholder="Rahul"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Last name</label>
              <input
                required
                minLength={2}
                value={form.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                className={inputClass}
                placeholder="Sharma"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Phone</label>
              <input
                required
                type="tel"
                maxLength={12}
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className={inputClass}
                placeholder="9876543210"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                className={inputClass}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Password</label>
            <input
              required
              type="password"
              minLength={6}
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              className={inputClass}
              placeholder="Min 6 characters"
            />
          </div>

          <div className="border-t border-white/10 pt-6">
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-slate-400">
              Pickup Address
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Street / Flat / Building</label>
                <input
                  required
                  value={form.address.street}
                  onChange={(e) => updateAddress('street', e.target.value)}
                  className={inputClass}
                  placeholder="Flat 402, Green Valley Apartments"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">City</label>
                <input
                  required
                  value={form.address.city}
                  onChange={(e) => updateAddress('city', e.target.value)}
                  className={inputClass}
                  placeholder="Bangalore"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">State</label>
                <select
                  required
                  value={form.address.state}
                  onChange={(e) => updateAddress('state', e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select state</option>
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
                  required
                  maxLength={6}
                  pattern="[0-9]{6}"
                  value={form.address.pincode}
                  onChange={(e) => updateAddress('pincode', e.target.value)}
                  className={inputClass}
                  placeholder="560001"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Country</label>
                <input
                  required
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
            {loading ? <LoadingSpinner size="sm" /> : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-t2c-400 hover:text-t2c-300">
            Log in
          </Link>
        </p>

        <div className="mt-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 text-center">
          <p className="text-sm text-slate-300">
            Want to earn by collecting recyclables instead?
          </p>
          <Link
            to="/register/inspector"
            className="mt-3 inline-flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-600/20 px-5 py-2.5 text-sm font-semibold text-blue-300 transition hover:bg-blue-600/30"
          >
            Register as an Inspector
          </Link>
        </div>
      </div>
    </div>
  )
}
