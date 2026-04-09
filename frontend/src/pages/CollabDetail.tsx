import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { apiService } from '../services/api'
import { Collaboration } from '../types'

const CollabDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [collab, setCollab] = useState<Collaboration | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCollab = async () => {
      try {
        const response = await apiService.get(`/collaborations/${id}`)
        setCollab(response.data.data)
      } catch (err) {
        setError('콜라보 정보를 불러올 수 없습니다.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchCollab()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !collab) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">{error || '콜라보를 찾을 수 없습니다.'}</p>
        <Link to="/collabs" className="text-blue-600 hover:underline">
          &larr; 목록으로 돌아가기
        </Link>
      </div>
    )
  }

  const brandNames = [collab.brand_a?.name, collab.brand_b?.name]
    .filter(Boolean)
    .join(' x ')

  const releaseDate = collab.release_date
    ? new Date(collab.release_date).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Back link */}
      <Link
        to="/collabs"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
      >
        &larr; 목록으로
      </Link>

      {/* Image */}
      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center overflow-hidden">
        {collab.image_url ? (
          <img
            src={collab.image_url}
            alt={collab.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-5xl font-bold text-gray-300">{brandNames}</span>
        )}
      </div>

      {/* Info */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {collab.category && (
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              {collab.category}
            </span>
          )}
          {releaseDate && (
            <span className="text-sm text-gray-500">{releaseDate}</span>
          )}
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900">
          {collab.title}
        </h1>

        {/* Brands */}
        <div className="flex items-center gap-4">
          {collab.brand_a && (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
                {collab.brand_a.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {collab.brand_a.name}
                </p>
                {collab.brand_a.category && (
                  <p className="text-xs text-gray-500">
                    {collab.brand_a.category}
                  </p>
                )}
              </div>
            </div>
          )}
          <span className="text-2xl text-gray-300 font-light">&times;</span>
          {collab.brand_b && (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
                {collab.brand_b.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {collab.brand_b.name}
                </p>
                {collab.brand_b.category && (
                  <p className="text-xs text-gray-500">
                    {collab.brand_b.category}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {collab.description && (
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {collab.description}
            </p>
          </div>
        )}

        {/* Source */}
        {collab.source_url && (
          <a
            href={collab.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm text-blue-600 hover:underline"
          >
            출처 보기 &rarr;
          </a>
        )}
      </div>
    </div>
  )
}

export default CollabDetail
