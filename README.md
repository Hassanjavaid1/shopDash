# ShopDash — Product Catalog & Cart Workspace

React + TypeScript + Redux Toolkit + Tailwind CSS (Vite).

## Setup
```bash
npm create vite@latest shopDash -- --template react-ts
npm install @reduxjs/toolkit react-redux
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm run dev     # http://localhost:5173
```
## Architecture
- `productsSlice`: `createAsyncThunk` handling pending / fulfilled / rejected; also holds search, category and selected product. Filtering is derived with memoized `createSelector` selectors.
- `cartSlice`: items, quantities, drawer state; `selectCartTotal` / `selectCartCount` selectors.
- `wishlistSlice`: favorite products.
- Typed hooks in `src/app/hooks.ts`. No `any`.

## API choice
Uses [DummyJSON](https://dummyjson.com/products) rather than FakeStore API, as dummyjson api provides a variety of data.

