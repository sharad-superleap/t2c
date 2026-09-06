import { Coins, Package, Trash2 } from 'lucide-react'
import { formatInr } from '../../utils/formatters'

export default function ProductCard({
  product,
  onClick,
  showAdminMeta = false,
  onDelete,
  deleting = false,
}) {
  const image = product.imageUrls?.[0]
  const discounted = product.discountedPrice ?? product.mrp
  const hasDiscount = Number(product.discountPercentage) > 0
  const maxCoins = Math.round((discounted || 0) * (Number(product.maxCoinPercent) || 0) / 100)

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left transition hover:border-t2c-500/40 hover:bg-white/[0.07]">
      <button
        type="button"
        onClick={() => onClick(product._id)}
        className="flex flex-1 flex-col text-left"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-600">
              <Package className="h-10 w-10" />
            </div>
          )}
          {hasDiscount && (
            <span className="absolute left-3 top-3 rounded-full bg-t2c-600 px-2.5 py-0.5 text-xs font-semibold text-white">
              {product.discountPercentage}% off
            </span>
          )}
          {showAdminMeta && (
            <span
              className={`absolute right-3 top-3 rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                product.isActive
                  ? 'border-t2c-500/40 bg-t2c-500/20 text-t2c-300'
                  : 'border-slate-500/40 bg-slate-800/80 text-slate-300'
              }`}
            >
              {product.isActive ? 'Active' : 'Inactive'}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4 pb-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
            {product.brand}
            {product.category ? ` · ${product.category}` : ''}
          </p>
          <h3 className="mt-1 line-clamp-2 font-display text-base font-semibold text-white">
            {product.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-slate-400">{product.description}</p>

          <div className="mt-auto pt-4">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-lg font-bold text-white">
                {formatInr(discounted, product.currency)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-slate-500 line-through">
                  {formatInr(product.mrp, product.currency)}
                </span>
              )}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 text-coin-400">
                <Coins className="h-3.5 w-3.5" />
                Up to {maxCoins} coins
              </span>
              <span>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
            </div>
          </div>
        </div>
      </button>

      {onDelete && (
        <div className="border-t border-white/10 px-4 py-3">
          <button
            type="button"
            disabled={deleting}
            onClick={() => onDelete(product)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            {deleting ? 'Deleting…' : 'Delete product'}
          </button>
        </div>
      )}
    </div>
  )
}
