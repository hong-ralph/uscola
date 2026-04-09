import { supabase } from '../config/supabase'
import { Brand } from '../types'

export class BrandService {
  async getAllBrands(): Promise<Brand[]> {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('name')

    if (error) throw error
    return data as Brand[]
  }

  async getBrandById(id: number): Promise<Brand | null> {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }

    return data as Brand
  }

  async createBrand(
    brand: Pick<Brand, 'name' | 'category' | 'logo_url' | 'website'>
  ): Promise<Brand> {
    const { data, error } = await supabase
      .from('brands')
      .insert(brand)
      .select()
      .single()

    if (error) throw error
    return data as Brand
  }

  async searchBrands(query: string): Promise<Brand[]> {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .ilike('name', `%${query}%`)
      .order('name')
      .limit(20)

    if (error) throw error
    return data as Brand[]
  }
}
