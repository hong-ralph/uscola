import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { apiService } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { Collaboration } from '../types'

const CollabDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [collab, setCollab] = useState<Collaboration | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

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

  const handleDelete = async () => {
    setDeleting(true)
    setDeleteError(null)
    try {
      const headers: Record<string, string> = {}
      if (!user && deletePassword) {
        headers['x-guest-password'] = deletePassword
      }
      await apiService.delete(`/collaborations/${id}`, { headers })
      navigate('/collabs')
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } }
      setDeleteError(error.response?.data?.error || '삭제에 실패했습니다.')
    } finally {
      setDeleting(false)
    }
  }

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
        <p className="text-gray-500 mb-4">
          {error || '콜라보를 찾을 수 없습니다.'}
        </p>
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

  // 회원 본인 글이거나, 비회원 글(guest_password_hash가 있는)이면 삭제 가능
  const isOwner = user && collab.submitted_by === user.id
  const isGuestPost = !collab.submitted_by
  const canDelete = isOwner || isGuestPost

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

        <div className="flex items-start justify-between">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {collab.title}
          </h1>
          {canDelete && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="text-sm text-red-500 hover:text-red-700 transition-colors shrink-0 ml-4"
            >
              삭제
            </button>
          )}
        </div>

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

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              콜라보 삭제
            </h3>

            {isOwner ? (
              <p className="text-sm text-gray-600 mb-4">
                이 콜라보를 정말 삭제하시겠습니까?
              </p>
            ) : (
              <div className="space-y-3 mb-4">
                <p className="text-sm text-gray-600">
                  등록 시 설정한 비밀번호를 입력해주세요.
                </p>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={e => setDeletePassword(e.target.value)}
                  placeholder="비밀번호"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            )}

            {deleteError && (
              <p className="text-sm text-red-600 mb-3">{deleteError}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeletePassword('')
                  setDeleteError(null)
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting || (!isOwner && !deletePassword)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CollabDetail
