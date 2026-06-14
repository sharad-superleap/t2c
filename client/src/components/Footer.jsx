import { Leaf, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-t2c-600">
                <Leaf className="h-4 w-4 text-white" />
              </div>
              <span className="font-display text-lg font-bold">Trash2Cash</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              India&apos;s first gamified recycling rewards platform. Your waste still has value.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-slate-300">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/schedule" className="hover:text-t2c-400">Schedule Pickup</Link></li>
              <li><Link to="/history" className="hover:text-t2c-400">Pickup History</Link></li>
              <li><Link to="/dashboard" className="hover:text-t2c-400">Impact Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-slate-300">
              Vision
            </h4>
            <p className="text-sm italic text-slate-400">
              &ldquo;Make recycling rewarding, convenient, and habit-forming for every Indian household.&rdquo;
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Trash2Cash. Built for a cleaner India.
          </p>
          <p className="flex items-center gap-1 text-xs text-slate-500">
            Made with <Heart className="h-3 w-3 text-red-400" /> for the planet
          </p>
        </div>
      </div>
    </footer>
  )
}
