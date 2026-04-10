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
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-8">
      {/* ===== HERO ===== */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-[#0a0a0f] overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[128px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[128px]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[160px]"></div>
        </div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        ></div>

        <div className="relative max-w-6xl mx-auto px-6 py-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 mb-10 backdrop-blur-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            10+ collaborations tracked
          </div>

          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-extrabold tracking-tight text-white leading-[0.95] mb-8">
            세상의 모ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ든
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              콜라보레이션
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-14 leading-relaxed font-light">
            Nike &times; Dior, Supreme &times; Louis Vuitton
            <br className="hidden sm:block" />
            그리고 당신이 발견한 콜라보까지.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/collabs"
              className="group px-10 py-4 bg-white text-gray-900 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all shadow-2xl shadow-white/10"
            >
              콜라보 둘러보기
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">
                &rarr;
              </span>
            </Link>
            <Link
              to="/submit"
              className="px-10 py-4 bg-white/5 text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-all border border-white/10 backdrop-blur-sm"
            >
              콜라보 제보하기
            </Link>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      {/* ===== METRICS ===== */}
      <section className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '22+', label: '브랜드' },
              { value: '10+', label: '콜라보' },
              { value: '6', label: '카테고리' },
              { value: '\u221E', label: '가능성' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 mt-2 uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BENTO CATEGORIES ===== */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-28">
          <div className="max-w-2xl mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              모든 카테고리의
              <br />
              콜라보를 탐색하세요
            </h2>
            <p className="text-lg text-gray-500 mt-6 leading-relaxed">
              패션부터 테크까지, 브랜드 간의 특별한 만남을 카테고리별로 모아봤습니다.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {[
              {
                name: '패션',
                desc: '의류, 액세서리, 럭셔리 브랜드의 만남',
                gradient: 'from-rose-50 to-pink-50',
                border: 'hover:border-rose-300',
                size: 'md:col-span-2 md:row-span-2',
                textSize: 'text-2xl md:text-4xl',
                descSize: 'text-sm md:text-base',
                padding: 'p-8 md:p-12',
              },
              {
                name: '신발',
                desc: '스니커즈, 한정판 릴리즈',
                gradient: 'from-blue-50 to-indigo-50',
                border: 'hover:border-blue-300',
                size: '',
                textSize: 'text-xl md:text-2xl',
                descSize: 'text-sm',
                padding: 'p-6 md:p-8',
              },
              {
                name: 'F&B',
                desc: '음식, 음료, 카페',
                gradient: 'from-amber-50 to-yellow-50',
                border: 'hover:border-amber-300',
                size: '',
                textSize: 'text-xl md:text-2xl',
                descSize: 'text-sm',
                padding: 'p-6 md:p-8',
              },
              {
                name: '라이프스타일',
                desc: '가구, 인테리어, 일상',
                gradient: 'from-green-50 to-emerald-50',
                border: 'hover:border-green-300',
                size: '',
                textSize: 'text-xl md:text-2xl',
                descSize: 'text-sm',
                padding: 'p-6 md:p-8',
              },
              {
                name: '테크',
                desc: '전자기기, 소프트웨어',
                gradient: 'from-cyan-50 to-sky-50',
                border: 'hover:border-cyan-300',
                size: '',
                textSize: 'text-xl md:text-2xl',
                descSize: 'text-sm',
                padding: 'p-6 md:p-8',
              },
              {
                name: '엔터테인먼트',
                desc: '음악, 영화, 아트',
                gradient: 'from-purple-50 to-violet-50',
                border: 'hover:border-purple-300',
                size: 'col-span-2 md:col-span-1',
                textSize: 'text-xl md:text-2xl',
                descSize: 'text-sm',
                padding: 'p-6 md:p-8',
              },
            ].map(cat => (
              <Link
                key={cat.name}
                to={`/collabs?category=${encodeURIComponent(cat.name)}`}
                className={`group bg-gradient-to-br ${cat.gradient} rounded-2xl md:rounded-3xl border border-gray-200 ${cat.border} ${cat.padding} ${cat.size} flex flex-col justify-end hover:shadow-xl transition-all duration-300`}
              >
                <h3
                  className={`${cat.textSize} font-bold text-gray-900 group-hover:text-gray-700 transition-colors`}
                >
                  {cat.name}
                </h3>
                <p
                  className={`${cat.descSize} text-gray-500 mt-1.5 leading-relaxed`}
                >
                  {cat.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RECENT COLLABS ===== */}
      <section className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-28">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                최신 콜라보
              </h2>
              <p className="text-lg text-gray-500 mt-4">
                최근 등록된 콜라보를 확인하세요
              </p>
            </div>
            <Link
              to="/collabs"
              className="hidden sm:inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-white hover:shadow-sm transition-all"
            >
              전체보기 <span>&rarr;</span>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-24">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : collabs.length === 0 ? (
            <p className="text-center text-gray-400 py-24 text-lg">
              등록된 콜라보가 없습니다.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collabs.map(collab => (
                <CollabCard key={collab.id} collab={collab} />
              ))}
            </div>
          )}

          <div className="text-center mt-10 sm:hidden">
            <Link
              to="/collabs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gray-300 text-gray-700 font-medium"
            >
              전체보기 <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-[#0a0a0f] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[128px]"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 py-32 text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
            새로운 콜라보를
            <br />
            발견하셨나요?
          </h2>
          <p className="text-lg text-gray-400 mb-12 max-w-lg mx-auto leading-relaxed">
            아직 등록되지 않은 콜라보를 공유해주세요.
            <br />
            회원가입 없이도 제보할 수 있습니다.
          </p>
          <Link
            to="/submit"
            className="group inline-flex items-center gap-2 px-10 py-4 bg-white text-gray-900 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all shadow-2xl shadow-white/10"
          >
            콜라보 제보하기
            <span className="group-hover:translate-x-1 transition-transform">
              &rarr;
            </span>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
