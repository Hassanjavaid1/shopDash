import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { selectProduct, selectSelectedProduct } from '../features/products/productsSlice'
import { addToCart, setCartOpen } from '../features/cart/cartSlice'

export default function ProductModal() {
  const dispatch = useAppDispatch()
  const product = useAppSelector(selectSelectedProduct)
  const close = () => dispatch(selectProduct(null))

  useEffect(() => {
    if (!product) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && dispatch(selectProduct(null))
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [product, dispatch])

  if (!product) return null
  const inStock = product.stock > 0

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-slate-900/60 p-4" onClick={close}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={product.title}
        onClick={(e) => e.stopPropagation()}
        className="grid max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl bg-white md:grid-cols-2"
      >
        <div className="bg-slate-100">
          <img src={product.images[0] ?? product.thumbnail} alt={product.title} className="h-full w-full object-contain" />
        </div>
        <div className="flex flex-col gap-3 p-6">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-xl font-bold text-slate-900">{product.title}</h2>
            <button onClick={close} aria-label="Close" className="text-2xl leading-none text-slate-400 hover:text-slate-700">×</button>
          </div>
          <p className="text-sm capitalize text-slate-500">{product.category}</p>
          <p className="text-slate-700">{product.description}</p>
          <p className={`text-sm font-medium ${inStock ? 'text-emerald-700' : 'text-rose-600'}`}>
            {inStock ? `${product.availabilityStatus} (${product.stock} left)` : 'Out of stock'}
          </p>
          <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
          <button
            disabled={!inStock}
            onClick={() => { dispatch(addToCart(product)); dispatch(selectProduct(null)); dispatch(setCartOpen(true)) }}
            className="mt-auto rounded-lg bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  )
}
