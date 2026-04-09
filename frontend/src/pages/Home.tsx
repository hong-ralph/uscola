import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiService } from '../services/api'
import { Collaboration } from '../types'
import CollabCard from '../components/CollabCard'

const Home: React.FC = () => {
  const [collabs, setCollabs] = useState<Collaboration[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCollabs = async () => {
      try {
        const response = await apiService.get('/collaborations?limit=6')
        setCollabs(response.data.data)
      } catch (err) {
        console.error('Error fetching collaborations:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCollabs()
  }, [])

  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="text-center py-12">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          uscola
        </h1>
        <p className="text-xl text-gray-500 max-w-xl mx-auto">
          세상의 모든 콜라보를 한 곳에서
        </p>
      </div>

      {/* Recent Collabs */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">최신 콜라보</h2>
          <Link
            to="/collabs"
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            전체보기 &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : collabs.length === 0 ? (
          <p className="text-center text-gray-500 py-12">
            등록된 콜라보가 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collabs.map(collab => (
              <CollabCard key={collab.id} collab={collab} />
            ))}
          </div>
        )}
      </div>

      {/* Category Quick Links */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">카테고리</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['패션', '신발', 'F&B', '라이프스타일'].map(cat => (
            <Link
              key={cat}
              to={`/collabs?category=${encodeURIComponent(cat)}`}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:shadow-md hover:border-blue-300 transition-all"
            >
              <span className="text-lg font-semibold text-gray-800">
                {cat}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
