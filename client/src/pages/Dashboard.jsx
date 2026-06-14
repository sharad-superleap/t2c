import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Calendar, Coins, Leaf, Package, Recycle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getPickupHistory } from '../api/pickups'
import StatCard from '../components/StatCard'
import LoadingSpinner from '../components/LoadingSpinner'
import Alert from '../components/Alert'
import { estimateCoins } from '../utils/formatters'

export default function Dashboard() {
  const { user } = useAuth()
  const [pickups, setPickups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getPickupHistory()
      .then((data) => setPickups(data.pickups || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const totalPickups = pickups.length
  const completedPickups = pickups.filter((p) => p.status === 'picked_up').length
  const pendingPickups = pickups.filter((p) => p.status === 'pending' || p.status === 'assigned').length
  const totalCoins = pickups.reduce((sum, p) => sum + estimateCoins(p.wasteTypes), 0)
  const wasteKgEstimate = completedPickups * 2.5

  const recentPickups = [...pickups]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">
          Hi, {user?.firstName}! 👋
        </h1>
        <p className="mt-2 text-slate-400">
          Your recycling dashboard — track pickups, coins, and environmental impact.
        </p>
      </div>

      {error && (
        <div className="mb-6">
          <Alert type="error" message={error} />
        </div>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Coins} label="TrashCoins Earned" value={totalCoins} subtext="Estimated from pickups" accent="coin" />
        <StatCard icon={Package} label="Total Pickups" value={totalPickups} subtext={`${pendingPickups} active`} accent="t2c" />
        <StatCard icon={Recycle} label="Waste Recycled" value={`${wasteKgEstimate.toFixed(1)} kg`} subtext="Estimated weight" accent="blue" />
        <StatCard icon={Leaf} label="CO₂ Saved" value={`${(wasteKgEstimate * 1.2).toFixed(1)} kg`} subtext="Approx. impact" accent="t2c" />
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <Link
          to="/schedule"
          className="group flex items-center gap-4 rounded-2xl border border-t2c-500/30 bg-gradient-to-br from-t2c-500/20 to-emerald-600/5 p-6 transition hover:border-t2c-500/50"
        >
          <div className="rounded-xl bg-t2c-500 p-3 text-white shadow-lg shadow-t2c-500/30 transition group-hover:scale-105">
            <Bell className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-display font-semibold">Ring the Bell</h3>
            <p className="text-sm text-slate-400">Schedule a new doorstep pickup</p>
          </div>
        </Link>

        <Link
          to="/history"
          className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20"
        >
          <div className="rounded-xl bg-white/10 p-3 text-slate-300 transition group-hover:scale-105">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-display font-semibold">Pickup History</h3>
            <p className="text-sm text-slate-400">View and manage all requests</p>
          </div>
        </Link>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Recent Pickups</h2>
          <Link to="/history" className="text-sm text-t2c-400 hover:text-t2c-300">
            View all →
          </Link>
        </div>

        {recentPickups.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center">
            <Recycle className="mx-auto mb-4 h-12 w-12 text-slate-600" />
            <p className="text-slate-400">No pickups yet. Schedule your first one!</p>
            <Link
              to="/schedule"
              className="mt-4 inline-block rounded-xl bg-t2c-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-t2c-500"
            >
              Schedule Pickup
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            {recentPickups.map((pickup) => (
              <div key={pickup._id} className="glass rounded-xl p-4">
                <div className="mb-2 flex flex-wrap gap-1">
                  {pickup.wasteTypes?.map((t) => (
                    <span key={t} className="rounded bg-white/5 px-2 py-0.5 text-xs capitalize text-slate-400">
                      {t}
                    </span>
                  ))}
                </div>
                <p className="text-sm capitalize text-slate-300">{pickup.status?.replace('_', ' ')}</p>
                <p className="mt-1 text-xs text-coin-400">~{estimateCoins(pickup.wasteTypes)} coins</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
