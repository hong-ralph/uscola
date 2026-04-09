import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { apiService } from '../services/api'
import { Collaboration } from '../types'
import CollabCard from '../components/CollabCard'

const CATEGORIES = ['전체', '패션', '신발', 'F&B', '라이프스타일', '테크', '엔터테인먼트']

const Collabs: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [collabs, setCollabs] = useState<Collaboration[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const category = searchParams.get('category') || '전체'
  const page = Number(searchParams.get('page') || '1')
  const sort = searchParams.get('sort') || 'latest'

  useEffect(() => {
    const fetchCollabs = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        params.set('page', String(page))
        params.set('limit', '12')
        params.set('sort', sort)
        if (category !== '전체') params.set('category', category)

        const response = await apiService.get(
          `/collaborations?${params.toString()}`
        )
        setCollabs(response.data.data)
        setTotalPages(response.data.pagination.totalPages)
        setTotal(response.data.pagination.total)
      } catch (err) {
        console.error('Error fetching collaborations:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCollabs()
  }, [category, page, sort])

  const setCategory = (cat: string) => {
    const params = new URLSearchParams(searchParams)
    if (cat === '전체') {
      params.delete('category')
    } else {
      params.set('category', cat)
    }
    params.delete('page')
    setSearchParams(params)
  }

  const setSort = (s: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('sort', s)
    params.delete('page')
    setSearchParams(params)
  }

  const setPage = (p: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(p))
    setSearchParams(params)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">콜라보 목록</h1>
        <p className="mt-1 text-gray-500">총 {total}개의 콜라보</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="ml-auto px-3 py-1.5 rounded-lg border border-gray-300 text-sm bg-white"
        >
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : collabs.length === 0 ? (
        <p className="text-center text-gray-500 py-16">
          해당 카테고리에 콜라보가 없습니다.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collabs.map(collab => (
            <CollabCard key={collab.id} collab={collab} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                page === p
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Collabs
