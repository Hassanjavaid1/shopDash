import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from './app/hooks'
import {
  fetchProducts, selectCategories, selectFilteredProducts, setCategory, setSearch,
} from './features/products/productsSlice'
import { selectCartCount, setCartOpen } from './features/cart/cartSlice'
import ProductCard from './components/ProductCard'
import ProductModal from './components/ProductModal'
import CartDrawer from './components/CartDrawer'

export default function App() {
  const dispatch = useAppDispatch()
  const { status, error, search, category } = useAppSelector((s) => s.products)
  const filtered = useAppSelector(selectFilteredProducts)
  const categories = useAppSelector(selectCategories)
  const cartCount = useAppSelector(selectCartCount)
  const wishlist = useAppSelector((s) => s.wishlist.items)
  const [showWishlist, setShowWishlist] = useState(false)

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProducts())
  }, [status, dispatch])

  const visible = showWishlist
    ? wishlist.filter((p) => (category === 'all' || p.category === category) && p.title.toLowerCase().includes(search.trim().toLowerCase()))
    : filtered

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 p-4">
          <h1 className="text-xl font-extrabold text-emerald-700">ShopDash</h1>
          <input
            type="search"
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            placeholder="Search products by title"
            aria-label="Search products"
            className="order-last w-full rounded-lg border border-slate-300 px-3 py-2 sm:order-none sm:ml-4 sm:w-auto sm:flex-1 sm:max-w-md"
          />
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setShowWishlist((v) => !v)}
              aria-pressed={showWishlist}
              className={`rounded-lg border px-3 py-2 text-sm font-medium ${showWishlist ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-slate-300'}`}
            >
              ♥ Wishlist ({wishlist.length})
            </button>
            <button onClick={() => dispatch(setCartOpen(true))} className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
              Cart ({cartCount})
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4">
        <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {['all', ...categories].map((c) => (
            <button
              key={c}
              onClick={() => dispatch(setCategory(c))}
              aria-pressed={category === c}
              className={`rounded-full border px-3 py-1 text-sm capitalize ${category === c ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-slate-300 bg-white hover:border-emerald-600'}`}
            >
              {c.replace('-', ' ')}
            </button>
          ))}
        </div>

        {status === 'loading' && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4" aria-busy="true">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-xl bg-slate-200" />
            ))}
          </div>
        )}

        {status === 'failed' && (
          <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center">
            <p className="font-semibold text-rose-700">We couldn't load products.</p>
            <p className="text-sm text-rose-600">{error}</p>
            <button onClick={() => dispatch(fetchProducts())} className="mt-3 rounded-lg bg-rose-600 px-4 py-2 text-white">Try again</button>
          </div>
        )}

        {status === 'succeeded' && visible.length === 0 && (
          <p className="py-16 text-center text-slate-500">
            {showWishlist ? 'No wishlist items match. Tap the heart on a product to save it.' : 'No products match your search. Try a different term or category.'}
          </p>
        )}

        {status === 'succeeded' && visible.length > 0 && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {visible.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </main>

      <ProductModal />
      <CartDrawer />
    </div>
  )
}
