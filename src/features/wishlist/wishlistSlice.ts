import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Product } from '../products/types'

interface WishlistState {
  items: Product[]
}

const initialState: WishlistState = { items: [] }

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist(state, action: PayloadAction<Product>) {
      const exists = state.items.some((p) => p.id === action.payload.id)
      state.items = exists
        ? state.items.filter((p) => p.id !== action.payload.id)
        : [...state.items, action.payload]
    },
  },
})

export const { toggleWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
