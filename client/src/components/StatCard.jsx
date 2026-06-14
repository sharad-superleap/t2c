export default function StatCard({ icon: Icon, label, value, subtext, accent = 't2c' }) {
  const accents = {
    t2c: 'from-t2c-500/20 to-emerald-600/5 border-t2c-500/20 text-t2c-400',
    coin: 'from-coin-500/20 to-amber-600/5 border-coin-500/20 text-coin-400',
    blue: 'from-blue-500/20 to-indigo-600/5 border-blue-500/20 text-blue-400',
  }

  return (
    <div className={`glass rounded-2xl border bg-gradient-to-br p-5 ${accents[accent]}`}>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-400">{label}</span>
        {Icon && <Icon className="h-5 w-5 opacity-80" />}
      </div>
      <p className="font-display text-3xl font-bold text-white">{value}</p>
      {subtext && <p className="mt-1 text-xs text-slate-500">{subtext}</p>}
    </div>
  )
}
