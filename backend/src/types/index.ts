// Brand
export interface Brand {
  id: number
  name: string
  logo_url: string | null
  category: string | null
  website: string | null
  created_at: string
}

// Collaboration
export interface Collaboration {
  id: number
  title: string
  description: string | null
  brand_a_id: number
  brand_b_id: number
  category: string | null
  image_url: string | null
  release_date: string | null
  source_url: string | null
  status: 'draft' | 'pending' | 'published'
  submitted_by: string | null
  created_at: string
  updated_at: string
  brand_a?: Brand
  brand_b?: Brand
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
