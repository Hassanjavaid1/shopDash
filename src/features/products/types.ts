export interface Product {
  id: number
  title: string
  description: string
  category: string
  price: number
  rating: number
  stock: number
  availabilityStatus: string
  thumbnail: string
  images: string[]
}

export interface ProductsResponse {
  products: Product[]
}

export type LoadStatus = 'idle' | 'loading' | 'succeeded' | 'failed'
