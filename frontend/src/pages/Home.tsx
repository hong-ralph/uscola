import React, { useState, useEffect } from 'react'
import { apiService } from '../services/api'

const Home: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<string>('확인 중...')

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        await apiService.get('/test')
        setApiStatus('API 연결 성공! ✅')
      } catch (error: any) {
        setApiStatus('API 연결 실패 ❌')
        console.error('API Error:', error)
        console.error('API_BASE_URL:', import.meta.env.VITE_API_URL || 'Not set')
        console.error('Current environment:', import.meta.env.MODE)
      }
    }

    checkApiStatus()
  }, [])

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Uscola에 오신 것을 환영합니다! 🎉
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Express + React + TypeScript 풀스택 애플리케이션
        </p>
      </div>
      
      {/* Status Card */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          시스템 상태
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">백엔드 API:</span>
            <span className={`font-medium ${apiStatus.includes('성공') ? 'text-green-600' : apiStatus.includes('실패') ? 'text-red-600' : 'text-yellow-600'}`}>
              {apiStatus}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">프론트엔드:</span>
            <span className="font-medium text-green-600">정상 작동 중 ✅</span>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">주요 기능</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <span className="text-gray-700">TypeScript로 작성된 Express 백엔드</span>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <span className="text-gray-700">React + TypeScript 프론트엔드</span>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <span className="text-gray-700">REST API 구조</span>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <span className="text-gray-700">실시간 개발 환경</span>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <span className="text-gray-700">코드 품질 도구 (ESLint, Prettier)</span>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <span className="text-gray-700">Tailwind CSS UI 프레임워크</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home