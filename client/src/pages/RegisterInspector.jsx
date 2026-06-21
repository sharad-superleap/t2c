import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldCheck, Truck } from 'lucide-react'
import { registerInspector } from '../api/inspector'
import Alert from '../components/Alert'
import LoadingSpinner from '../components/LoadingSpinner'
import { INDIAN_STATES, VEHICLE_TYPES } from '../utils/constants'

const emptyAddress = { street: '', city: '', state: '', pincode: '' }

export default function RegisterInspector() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    dateOfBirth: '',
    address: { ...emptyAddress },
    serviceablePincodes: '',
    aadhaarNumber: '',
    panNumber: '',
    vehicleType: '',
    vehicleName: '',
    vehicleRegNumber: '',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
  })

  const [files, setFiles] = useState({
    profilePhoto: null,
    aadhaarFront: null,
    aadhaarBack: null,
    panImage: null,
    rcImage: null,
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

  const handleFileChange = (field, file) => {
    setFiles((prev) => ({ ...prev, [field]: file }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.aadhaarNumber && !form.panNumber) {
      setError('Please provide at least an Aadhaar or PAN number.')
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('fullName', form.fullName)
      formData.append('email', form.email)
      formData.append('password', form.password)
      formData.append('phone', form.phone)
      formData.append('dateOfBirth', form.dateOfBirth)
      formData.append('address.street', form.address.street)
      formData.append('address.city', form.address.city)
      formData.append('address.state', form.address.state)
      formData.append('address.pincode', form.address.pincode)

      if (form.serviceablePincodes.trim()) {
        const pincodes = form.serviceablePincodes
          .split(',')
          .map((p) => p.trim())
          .filter(Boolean)
        formData.append('serviceablePincodes', JSON.stringify(pincodes))
      }

      if (form.aadhaarNumber) formData.append('kyc.aadhaar.number', form.aadhaarNumber)
      if (form.panNumber) formData.append('kyc.pan.number', form.panNumber)
      formData.append('vehicle.type', form.vehicleType)
      if (form.vehicleName) formData.append('vehicle.name', form.vehicleName)
      if (form.vehicleRegNumber) formData.append('vehicle.registrationNumber', form.vehicleRegNumber)
      if (form.accountHolderName) formData.append('bankDetails.accountHolderName', form.accountHolderName)
      if (form.accountNumber) formData.append('bankDetails.accountNumber', form.accountNumber)
      if (form.ifscCode) formData.append('bankDetails.ifscCode', form.ifscCode)
      if (form.upiId) formData.append('bankDetails.upiId', form.upiId)

      Object.entries(files).forEach(([key, file]) => {
        if (file) formData.append(key, file)
      })

      await registerInspector(formData)
      setSuccess('Application submitted! Redirecting to login...')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-t2c-500 focus:outline-none focus:ring-1 focus:ring-t2c-500'

  const fileClass =
    'w-full rounded-xl border border-dashed border-white/15 bg-white/5 px-4 py-2.5 text-sm text-slate-400 file:mr-4 file:rounded-lg file:border-0 file:bg-t2c-600 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-t2c-500'

  const sectionTitle = 'mb-4 font-display text-sm font-semibold uppercase tracking-wider text-slate-400'

  return (
    <div className="px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/20">
            <ShieldCheck className="h-7 w-7 text-blue-400" />
          </div>
          <h1 className="font-display text-2xl font-bold">Become an Inspector</h1>
          <p className="mt-2 text-sm text-slate-400">
            Join Trash2Cash as a pickup agent — earn per pickup, serve your locality
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass space-y-8 rounded-2xl p-6 sm:p-8">
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}
          {success && <Alert type="success" message={success} />}

          {/* Personal Details */}
          <div>
            <h3 className={sectionTitle}>Personal Details</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Full name</label>
                <input
                  required
                  value={form.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  className={inputClass}
                  placeholder="Rajesh Kumar"
                />
              </div>
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
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Date of birth</label>
                <input
                  required
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => updateField('dateOfBirth', e.target.value)}
                  className={inputClass}
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
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Profile photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange('profilePhoto', e.target.files?.[0] || null)}
                  className={fileClass}
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="border-t border-white/10 pt-6">
            <h3 className={sectionTitle}>Address</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Street / Area</label>
                <input
                  required
                  value={form.address.street}
                  onChange={(e) => updateAddress('street', e.target.value)}
                  className={inputClass}
                  placeholder="12, MG Road, Koramangala"
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
                <label className="mb-1.5 block text-sm font-medium text-slate-300">
                  Serviceable pincodes <span className="text-slate-500">(comma-separated)</span>
                </label>
                <input
                  value={form.serviceablePincodes}
                  onChange={(e) => updateField('serviceablePincodes', e.target.value)}
                  className={inputClass}
                  placeholder="560001, 560034, 560038"
                />
              </div>
            </div>
          </div>

          {/* KYC */}
          <div className="border-t border-white/10 pt-6">
            <h3 className={sectionTitle}>KYC Verification</h3>
            <p className="mb-4 text-xs text-slate-500">Provide at least Aadhaar or PAN details</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Aadhaar number</label>
                <input
                  maxLength={12}
                  pattern="[0-9]{12}"
                  value={form.aadhaarNumber}
                  onChange={(e) => updateField('aadhaarNumber', e.target.value)}
                  className={inputClass}
                  placeholder="12-digit Aadhaar"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">PAN number</label>
                <input
                  maxLength={10}
                  value={form.panNumber}
                  onChange={(e) => updateField('panNumber', e.target.value.toUpperCase())}
                  className={inputClass}
                  placeholder="ABCDE1234F"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Aadhaar front</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange('aadhaarFront', e.target.files?.[0] || null)}
                  className={fileClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Aadhaar back</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange('aadhaarBack', e.target.files?.[0] || null)}
                  className={fileClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">PAN card image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange('panImage', e.target.files?.[0] || null)}
                  className={fileClass}
                />
              </div>
            </div>
          </div>

          {/* Vehicle */}
          <div className="border-t border-white/10 pt-6">
            <h3 className={sectionTitle}>
              <Truck className="mr-1.5 inline h-4 w-4" />
              Vehicle Details
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Vehicle type</label>
                <select
                  required
                  value={form.vehicleType}
                  onChange={(e) => updateField('vehicleType', e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select vehicle</option>
                  {VEHICLE_TYPES.map((v) => (
                    <option key={v.id} value={v.id} className="bg-slate-900">
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Vehicle name / model</label>
                <input
                  value={form.vehicleName}
                  onChange={(e) => updateField('vehicleName', e.target.value)}
                  className={inputClass}
                  placeholder="Honda Activa 6G"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Registration number</label>
                <input
                  value={form.vehicleRegNumber}
                  onChange={(e) => updateField('vehicleRegNumber', e.target.value.toUpperCase())}
                  className={inputClass}
                  placeholder="KA01AB1234"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">RC book image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange('rcImage', e.target.files?.[0] || null)}
                  className={fileClass}
                />
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="border-t border-white/10 pt-6">
            <h3 className={sectionTitle}>Payout Details</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Account holder name</label>
                <input
                  value={form.accountHolderName}
                  onChange={(e) => updateField('accountHolderName', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Account number</label>
                <input
                  value={form.accountNumber}
                  onChange={(e) => updateField('accountNumber', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">IFSC code</label>
                <input
                  value={form.ifscCode}
                  onChange={(e) => updateField('ifscCode', e.target.value.toUpperCase())}
                  className={inputClass}
                  placeholder="SBIN0001234"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">UPI ID</label>
                <input
                  value={form.upiId}
                  onChange={(e) => updateField('upiId', e.target.value)}
                  className={inputClass}
                  placeholder="name@upi"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-semibold text-white transition hover:from-blue-500 hover:to-indigo-500 disabled:opacity-60"
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Submit Inspector Application'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Want to recycle as a household instead?{' '}
          <Link to="/register" className="font-medium text-t2c-400 hover:text-t2c-300">
            Register as a user
          </Link>
        </p>
      </div>
    </div>
  )
}
