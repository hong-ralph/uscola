import bcrypt from 'bcryptjs'
import { supabase } from '../config/supabase'
import { Collaboration, PaginatedResponse } from '../types'

interface CollaborationQuery {
  page?: number
  limit?: number
  category?: string
  brand?: string
  sort?: string
}

interface CreateCollaborationInput {
  title: string
  description?: string
  brand_a_id: number
  brand_b_id: number
  category?: string
  image_url?: string
  release_date?: string
  source_url?: string
  status?: string
  submitted_by?: string
  guest_nickname?: string
  guest_password?: string
}

const COLLAB_SELECT =
  '*, brand_a:brands!brand_a_id(*), brand_b:brands!brand_b_id(*)'

export class CollaborationService {
  async getCollaborations(
    query: CollaborationQuery
  ): Promise<PaginatedResponse<Collaboration>> {
    const page = query.page || 1
    const limit = query.limit || 20
    const offset = (page - 1) * limit

    let baseQuery = supabase
      .from('collaborations')
      .select(COLLAB_SELECT, { count: 'exact' })
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
      .select(COLLAB_SELECT)
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
    input: CreateCollaborationInput
  ): Promise<Collaboration> {
    const insertData: Record<string, unknown> = {
      title: input.title,
      description: input.description,
      brand_a_id: input.brand_a_id,
      brand_b_id: input.brand_b_id,
      category: input.category,
      image_url: input.image_url,
      release_date: input.release_date,
      source_url: input.source_url,
      status: input.status || 'published',
    }

    if (input.submitted_by) {
      insertData.submitted_by = input.submitted_by
    }

    if (input.guest_password) {
      insertData.guest_password_hash = await bcrypt.hash(
        input.guest_password,
        10
      )
      insertData.guest_nickname = input.guest_nickname || '익명'
    }

    const { data, error } = await supabase
      .from('collaborations')
      .insert(insertData)
      .select(COLLAB_SELECT)
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
      .select(COLLAB_SELECT)
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

  // 권한 체크: 회원이면 submitted_by, 비회원이면 비밀번호 검증
  async verifyOwnership(
    id: number,
    userId?: string,
    guestPassword?: string
  ): Promise<boolean> {
    const { data, error } = await supabase
      .from('collaborations')
      .select('submitted_by, guest_password_hash')
      .eq('id', id)
      .single()

    if (error || !data) return false

    // 회원: submitted_by 일치 확인
    if (userId && data.submitted_by === userId) return true

    // 비회원: 비밀번호 확인
    if (guestPassword && data.guest_password_hash) {
      return bcrypt.compare(guestPassword, data.guest_password_hash)
    }

    return false
  }
}
