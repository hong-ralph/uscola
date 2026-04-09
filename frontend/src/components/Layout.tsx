import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LoginModal from './LoginModal'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, loading, signOut } = useAuth()
  const [showLogin, setShowLogin] = useState(false)

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'text-white bg-slate-700'
        : 'text-gray-300 hover:text-white'
    }`

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-slate-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-extrabold tracking-tight">
              <Link
                to="/"
                className="text-white hover:text-blue-200 transition-colors"
              >
                uscola
              </Link>
            </h1>
            <div className="flex items-center space-x-4">
              <nav className="flex space-x-4">
                <NavLink to="/" end className={linkClass}>
                  홈
                </NavLink>
                <NavLink to="/collabs" className={linkClass}>
                  콜라보
                </NavLink>
                <NavLink to="/submit" className={linkClass}>
                  제보하기
                </NavLink>
              </nav>

              {!loading && (
                <>
                  {user ? (
                    <div className="flex items-center gap-3 ml-4">
                      <span className="text-sm text-gray-300">
                        {user.user_metadata?.full_name ||
                          user.user_metadata?.name ||
                          user.email}
                      </span>
                      <button
                        onClick={signOut}
                        className="text-xs text-gray-400 hover:text-white transition-colors"
                      >
                        로그아웃
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowLogin(true)}
                      className="ml-4 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      로그인
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            &copy; 2025 uscola. All rights reserved.
          </p>
        </div>
      </footer>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  )
}

export default Layout
