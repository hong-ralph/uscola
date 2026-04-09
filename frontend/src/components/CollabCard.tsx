import React from 'react'
import { Link } from 'react-router-dom'
import { Collaboration } from '../types'

interface Props {
  collab: Collaboration
}

const CollabCard: React.FC<Props> = ({ collab }) => {
  const brandNames = [collab.brand_a?.name, collab.brand_b?.name]
    .filter(Boolean)
    .join(' x ')

  const releaseDate = collab.release_date
    ? new Date(collab.release_date).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
      })
    : null

  return (
    <Link
      to={`/collabs/${collab.id}`}
      className="group block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all"
    >
      {/* Image placeholder */}
      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        {collab.image_url ? (
          <img
            src={collab.image_url}
            alt={collab.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-4xl font-bold text-gray-300 group-hover:text-gray-400 transition-colors">
            {brandNames || 'COLLAB'}
          </span>
        )}
      </div>

      <div className="p-4 space-y-2">
        {/* Category + Date */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          {collab.category && (
            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              {collab.category}
            </span>
          )}
          {releaseDate && <span>{releaseDate}</span>}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
          {collab.title}
        </h3>

        {/* Description */}
        {collab.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {collab.description}
          </p>
        )}
      </div>
    </Link>
  )
}

export default CollabCard
