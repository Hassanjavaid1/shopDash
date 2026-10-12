import { useAppDispatch, useAppSelector } from '../app/hooks'
import { selectProduct } from '../features/products/productsSlice'
import { toggleWishlist } from '../features/wishlist/wishlistSlice'
import type { Product } from '../features/products/types'

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch()
  const liked = useAppSelector((s) => s.wishlist.items.some((p) => p.id === product.id))

  return (
    <article
      onClick={() => dispatch(selectProduct(product.id))}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-emerald-600"
    >
      <button
        aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
        aria-pressed={liked}
        onClick={(e) => { e.stopPropagation(); dispatch(toggleWishlist(product)) }}
        className="absolute right-2 top-2 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-lg shadow focus-visible:outline-2 focus-visible:outline-emerald-600"
      >
        <span className={liked ? 'text-rose-500' : 'text-slate-400'}>{liked ? '♥' : '♡'}</span>
      </button>
      <div className="aspect-square bg-slate-100">
        <img src={product.thumbnail} alt={product.title} loading="lazy" className="h-full w-full object-contain" />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs capitalize text-slate-500">{product.category}</p>
        <h3 className="line-clamp-2 font-semibold text-slate-900">{product.title}</h3>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-lg font-bold text-slate-900">${product.price.toFixed(2)}</span>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
            ★ {product.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </article>
  )
}
