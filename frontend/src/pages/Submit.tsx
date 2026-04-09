import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiService } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { Brand } from '../types'

const CATEGORIES = ['패션', '신발', 'F&B', '라이프스타일', '테크', '엔터테인먼트', '기타']

const Submit: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(false)
  const [brandSearch, setBrandSearch] = useState({ a: '', b: '' })
  const [filteredBrands, setFilteredBrands] = useState<{
    a: Brand[]
    b: Brand[]
  }>({ a: [], b: [] })
  const [showDropdown, setShowDropdown] = useState({ a: false, b: false })

  const [form, setForm] = useState({
    title: '',
    description: '',
    brand_a_id: 0,
    brand_b_id: 0,
    category: '',
    release_date: '',
    source_url: '',
    image_url: '',
    guest_nickname: '',
    guest_password: '',
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await apiService.get('/brands')
        setBrands(response.data.data)
      } catch (err) {
        console.error('Error fetching brands:', err)
      }
    }
    fetchBrands()
  }, [])

  const handleBrandSearch = (side: 'a' | 'b', value: string) => {
    setBrandSearch(prev => ({ ...prev, [side]: value }))
    const filtered = value.length > 0
      ? brands.filter(b => b.name.toLowerCase().includes(value.toLowerCase()))
      : brands
    setFilteredBrands(prev => ({ ...prev, [side]: filtered }))
    setShowDropdown(prev => ({ ...prev, [side]: true }))
  }

  const selectBrand = (side: 'a' | 'b', brand: Brand) => {
    const key = side === 'a' ? 'brand_a_id' : 'brand_b_id'
    setForm(prev => ({ ...prev, [key]: brand.id }))
    setBrandSearch(prev => ({ ...prev, [side]: brand.name }))
    setShowDropdown(prev => ({ ...prev, [side]: false }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.brand_a_id || !form.brand_b_id) {
      setError('두 브랜드를 모두 선택해주세요.')
      return
    }

    if (form.brand_a_id === form.brand_b_id) {
      setError('서로 다른 브랜드를 선택해주세요.')
      return
    }

    setLoading(true)
    try {
      const payload: Record<string, unknown> = {
        title: form.title || autoTitle,
        brand_a_id: form.brand_a_id,
        brand_b_id: form.brand_b_id,
        status: 'published',
      }
      if (form.description) payload.description = form.description
      if (form.category) payload.category = form.category
      if (form.release_date) payload.release_date = form.release_date
      if (form.source_url) payload.source_url = form.source_url
      if (form.image_url) payload.image_url = form.image_url
      if (!user) {
        if (form.guest_nickname) payload.guest_nickname = form.guest_nickname
        if (form.guest_password) payload.guest_password = form.guest_password
      }

      const response = await apiService.post('/collaborations', payload)
      navigate(`/collabs/${response.data.data.id}`)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } }
      setError(error.response?.data?.error || '등록에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const autoTitle =
    brandSearch.a && brandSearch.b
      ? `${brandSearch.a} x ${brandSearch.b}`
      : ''

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">콜라보 제보</h1>
      <p className="text-gray-500 mb-8">
        새로운 콜라보를 발견하셨나요? 공유해주세요!
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Brands */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(['a', 'b'] as const).map(side => (
            <div key={side} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                브랜드 {side === 'a' ? 'A' : 'B'} *
              </label>
              <input
                type="text"
                value={brandSearch[side]}
                onChange={e => handleBrandSearch(side, e.target.value)}
                onFocus={() => {
                  const filtered = brandSearch[side].length > 0
                    ? brands.filter(b => b.name.toLowerCase().includes(brandSearch[side].toLowerCase()))
                    : brands
                  setFilteredBrands(prev => ({ ...prev, [side]: filtered }))
                  setShowDropdown(prev => ({ ...prev, [side]: true }))
                }}
                placeholder="브랜드 검색..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {showDropdown[side] && filteredBrands[side].length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredBrands[side].map(brand => (
                    <li
                      key={brand.id}
                      onClick={() => selectBrand(side, brand)}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                    >
                      <span className="font-medium">{brand.name}</span>
                      {brand.category && (
                        <span className="text-gray-400 ml-2">
                          {brand.category}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            제목 *
          </label>
          <input
            type="text"
            value={form.title || autoTitle}
            onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
            placeholder="예: Nike x Off-White &quot;The Ten&quot;"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            카테고리
          </label>
          <select
            value={form.category}
            onChange={e =>
              setForm(prev => ({ ...prev, category: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">선택하세요</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            설명
          </label>
          <textarea
            value={form.description}
            onChange={e =>
              setForm(prev => ({ ...prev, description: e.target.value }))
            }
            rows={4}
            placeholder="이 콜라보에 대해 알려주세요..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>

        {/* Release Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            출시일
          </label>
          <input
            type="date"
            value={form.release_date}
            onChange={e =>
              setForm(prev => ({ ...prev, release_date: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Source URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            출처 URL
          </label>
          <input
            type="url"
            value={form.source_url}
            onChange={e =>
              setForm(prev => ({ ...prev, source_url: e.target.value }))
            }
            placeholder="https://..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            이미지 URL
          </label>
          <input
            type="url"
            value={form.image_url}
            onChange={e =>
              setForm(prev => ({ ...prev, image_url: e.target.value }))
            }
            placeholder="https://..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* 비회원 정보 */}
        {!user && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-4 border border-gray-200">
            <p className="text-sm font-medium text-gray-700">
              비회원 등록 (수정/삭제 시 비밀번호가 필요합니다)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  닉네임
                </label>
                <input
                  type="text"
                  value={form.guest_nickname}
                  onChange={e =>
                    setForm(prev => ({
                      ...prev,
                      guest_nickname: e.target.value,
                    }))
                  }
                  placeholder="익명"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호 *
                </label>
                <input
                  type="password"
                  value={form.guest_password}
                  onChange={e =>
                    setForm(prev => ({
                      ...prev,
                      guest_password: e.target.value,
                    }))
                  }
                  placeholder="4자 이상"
                  required
                  minLength={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '등록 중...' : '콜라보 등록하기'}
        </button>
      </form>
    </div>
  )
}

export default Submit
