import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import type { Product } from '../products/types'

export interface CartItem {
  product: Product
  quantity: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

const initialState: CartState = { items: [], isOpen: false }

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Product>) {
      const existing = state.items.find((i) => i.product.id === action.payload.id)
      if (existing) existing.quantity += 1
      else state.items.push({ product: action.payload, quantity: 1 })
    },
    increment(state, action: PayloadAction<number>) {
      const item = state.items.find((i) => i.product.id === action.payload)
      if (item) item.quantity += 1
    },
    decrement(state, action: PayloadAction<number>) {
      const item = state.items.find((i) => i.product.id === action.payload)
      if (!item) return
      if (item.quantity <= 1) state.items = state.items.filter((i) => i.product.id !== action.payload)
      else item.quantity -= 1
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter((i) => i.product.id !== action.payload)
    },
    setCartOpen(state, action: PayloadAction<boolean>) { state.isOpen = action.payload },
  },
})

export const { addToCart, increment, decrement, removeFromCart, setCartOpen } = cartSlice.actions
export default cartSlice.reducer

const selectCartItems = (s: RootState) => s.cart.items
export const selectCartCount = createSelector([selectCartItems], (items) =>
  items.reduce((n, i) => n + i.quantity, 0)
)
export const selectCartTotal = createSelector([selectCartItems], (items) =>
  items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
)
