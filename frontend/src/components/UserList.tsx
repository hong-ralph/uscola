import React from 'react'
import { User } from '../types/user'

interface UserListProps {
  users: User[]
  onDelete: (id: number) => Promise<void>
}

const UserList: React.FC<UserListProps> = ({ users, onDelete }) => {
  const handleDeleteClick = async (id: number, name: string) => {
    if (window.confirm(`정말로 ${name}을(를) 삭제하시겠습니까?`)) {
      await onDelete(id)
    }
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-5xl mb-4">👤</div>
        <p className="text-gray-500 text-lg">등록된 사용자가 없습니다.</p>
        <p className="text-gray-400 text-sm mt-2">새 사용자를 추가해보세요!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{user.name}</h3>
            <p className="text-gray-600 text-sm">{user.email}</p>
            <p className="text-gray-400 text-xs mt-1">
              생성일: {new Date(user.createdAt).toLocaleDateString('ko-KR')}
            </p>
          </div>
          <button
            onClick={() => handleDeleteClick(user.id, user.name)}
            className="ml-4 bg-red-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            삭제
          </button>
        </div>
      ))}
    </div>
  )
}

export default UserList