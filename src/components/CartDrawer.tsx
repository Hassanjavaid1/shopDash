import { useAppDispatch, useAppSelector } from '../app/hooks'
import { decrement, increment, removeFromCart, selectCartTotal, setCartOpen } from '../features/cart/cartSlice'

export default function CartDrawer() {
  const dispatch = useAppDispatch()
  const { items, isOpen } = useAppSelector((s) => s.cart)
  const total = useAppSelector(selectCartTotal)
  const close = () => dispatch(setCartOpen(false))

  return (
    <div className={`fixed inset-0 z-30 ${isOpen ? '' : 'pointer-events-none'}`} aria-hidden={!isOpen}>
      <div onClick={close} className={`absolute inset-0 bg-slate-900/50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <header className="flex items-center justify-between border-b border-slate-200 p-4">
          <h2 className="text-lg font-bold">Your cart</h2>
          <button onClick={close} aria-label="Close cart" className="text-2xl leading-none text-slate-400 hover:text-slate-700">×</button>
        </header>
        <ul className="flex-1 divide-y divide-slate-100 overflow-auto">
          {items.length === 0 && <li className="p-6 text-slate-500">Your cart is empty. Add a product to get started.</li>}
          {items.map(({ product, quantity }) => (
            <li key={product.id} className="flex gap-3 p-4">
              <img src={product.thumbnail} alt="" className="h-16 w-16 rounded bg-slate-100 object-contain" />
              <div className="flex flex-1 flex-col gap-2">
                <p className="line-clamp-1 font-medium">{product.title}</p>
                <p className="text-sm text-slate-500">${product.price.toFixed(2)}</p>
                <div className="flex items-center gap-2">
                  <button aria-label="Decrease quantity" onClick={() => dispatch(decrement(product.id))} className="h-7 w-7 rounded border border-slate-300 hover:bg-slate-100">−</button>
                  <span className="w-6 text-center text-sm">{quantity}</span>
                  <button aria-label="Increase quantity" onClick={() => dispatch(increment(product.id))} className="h-7 w-7 rounded border border-slate-300 hover:bg-slate-100">+</button>
                  <button onClick={() => dispatch(removeFromCart(product.id))} className="ml-auto text-sm text-rose-600 hover:underline">Remove</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <footer className="flex items-center justify-between border-t border-slate-200 p-4">
          <span className="text-slate-600">Total</span>
          <span className="text-xl font-bold">${total.toFixed(2)}</span>
        </footer>
      </aside>
    </div>
  )
}
