import { createAsyncThunk, createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import type { LoadStatus, Product, ProductsResponse } from './types'

export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('https://dummyjson.com/products?limit=100')
      if (!res.ok) return rejectWithValue(`Server responded with status ${res.status}.`)
      const data: ProductsResponse = await res.json()
      return data.products
    } catch {
      return rejectWithValue('Network error. Check your connection and try again.')
    }
  }
)

interface ProductsState {
  items: Product[]
  status: LoadStatus
  error: string | null
  search: string
  category: string
  selectedId: number | null
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
  search: '',
  category: 'all',
  selectedId: null,
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) { state.search = action.payload },
    setCategory(state, action: PayloadAction<string>) { state.category = action.payload },
    selectProduct(state, action: PayloadAction<number | null>) { state.selectedId = action.payload },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Something went wrong.'
      })
  },
})

export const { setSearch, setCategory, selectProduct } = productsSlice.actions
export default productsSlice.reducer

const selectItems = (s: RootState) => s.products.items
const selectSearch = (s: RootState) => s.products.search
const selectCategory = (s: RootState) => s.products.category

export const selectCategories = createSelector([selectItems], (items) =>
  Array.from(new Set(items.map((p) => p.category))).sort()
)

export const selectFilteredProducts = createSelector(
  [selectItems, selectSearch, selectCategory],
  (items, search, category) => {
    const q = search.trim().toLowerCase()
    return items.filter(
      (p) => (category === 'all' || p.category === category) && p.title.toLowerCase().includes(q)
    )
  }
)

export const selectSelectedProduct = (s: RootState): Product | undefined =>
  s.products.items.find((p) => p.id === s.products.selectedId)
