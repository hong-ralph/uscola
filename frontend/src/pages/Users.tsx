import React, { useState, useEffect } from 'react'
import { apiService } from '../services/api'
import UserForm from '../components/UserForm'
import UserList from '../components/UserList'
import { User, CreateUserData } from '../types/user'

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await apiService.get('/users')
      setUsers(response.data.data)
      setError(null)
    } catch (err) {
      setError('사용자 데이터를 불러오는데 실패했습니다.')
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (userData: CreateUserData) => {
    try {
      await apiService.post('/users', userData)
      await fetchUsers() // Refresh the list
    } catch (err) {
      setError('사용자 생성에 실패했습니다.')
      console.error('Error creating user:', err)
    }
  }

  const handleDeleteUser = async (id: number) => {
    try {
      await apiService.delete(`/users/${id}`)
      await fetchUsers() // Refresh the list
    } catch (err) {
      setError('사용자 삭제에 실패했습니다.')
      console.error('Error deleting user:', err)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">로딩 중...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">사용자 관리</h1>
        <p className="mt-2 text-gray-600">사용자를 추가하고 관리할 수 있습니다</p>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <span className="text-red-500 mr-2">⚠️</span>
            {error}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">새 사용자 추가</h2>
          <UserForm onSubmit={handleCreateUser} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">사용자 목록</h2>
          <UserList users={users} onDelete={handleDeleteUser} />
        </div>
      </div>
    </div>
  )
}

export default Users