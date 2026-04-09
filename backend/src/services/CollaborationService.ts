import { supabase } from '../config/supabase'
import { Collaboration, PaginatedResponse } from '../types'

interface CollaborationQuery {
  page?: number
  limit?: number
  category?: string
  brand?: string
  sort?: string
}

export class CollaborationService {
  async getCollaborations(
    query: CollaborationQuery
  ): Promise<PaginatedResponse<Collaboration>> {
    const page = query.page || 1
    const limit = query.limit || 20
    const offset = (page - 1) * limit

    let baseQuery = supabase
      .from('collaborations')
      .select(
        '*, brand_a:brands!brand_a_id(*), brand_b:brands!brand_b_id(*)',
        { count: 'exact' }
      )
      .eq('status', 'published')

    if (query.category) {
      baseQuery = baseQuery.eq('category', query.category)
    }

    if (query.brand) {
      baseQuery = baseQuery.or(
        `brand_a.name.ilike.%${query.brand}%,brand_b.name.ilike.%${query.brand}%`
      )
    }

    switch (query.sort) {
      case 'oldest':
        baseQuery = baseQuery.order('release_date', {
          ascending: true,
          nullsFirst: false,
        })
        break
      case 'popular':
        baseQuery = baseQuery.order('created_at', { ascending: false })
        break
      default:
        baseQuery = baseQuery.order('release_date', {
          ascending: false,
          nullsFirst: false,
        })
    }

    const { data, error, count } = await baseQuery.range(
      offset,
      offset + limit - 1
    )

    if (error) throw error

    const total = count || 0

    return {
      data: data as Collaboration[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async getCollaborationById(id: number): Promise<Collaboration | null> {
    const { data, error } = await supabase
      .from('collaborations')
      .select(
        '*, brand_a:brands!brand_a_id(*), brand_b:brands!brand_b_id(*)'
      )
      .eq('id', id)
      .eq('status', 'published')
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }

    return data as Collaboration
  }

  async createCollaboration(
    collab: Partial<Collaboration>
  ): Promise<Collaboration> {
    const { data, error } = await supabase
      .from('collaborations')
      .insert({
        title: collab.title,
        description: collab.description,
        brand_a_id: collab.brand_a_id,
        brand_b_id: collab.brand_b_id,
        category: collab.category,
        image_url: collab.image_url,
        release_date: collab.release_date,
        source_url: collab.source_url,
        status: collab.status || 'published',
        submitted_by: collab.submitted_by,
      })
      .select(
        '*, brand_a:brands!brand_a_id(*), brand_b:brands!brand_b_id(*)'
      )
      .single()

    if (error) throw error
    return data as Collaboration
  }

  async updateCollaboration(
    id: number,
    collab: Partial<Collaboration>
  ): Promise<Collaboration | null> {
    const { data, error } = await supabase
      .from('collaborations')
      .update({
        title: collab.title,
        description: collab.description,
        brand_a_id: collab.brand_a_id,
        brand_b_id: collab.brand_b_id,
        category: collab.category,
        image_url: collab.image_url,
        release_date: collab.release_date,
        source_url: collab.source_url,
        status: collab.status,
      })
      .eq('id', id)
      .select(
        '*, brand_a:brands!brand_a_id(*), brand_b:brands!brand_b_id(*)'
      )
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }

    return data as Collaboration
  }

  async deleteCollaboration(id: number): Promise<boolean> {
    const { error, count } = await supabase
      .from('collaborations')
      .delete({ count: 'exact' })
      .eq('id', id)

    if (error) throw error
    return (count || 0) > 0
  }
}
