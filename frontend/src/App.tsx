import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Collabs from './pages/Collabs'
import CollabDetail from './pages/CollabDetail'
import Submit from './pages/Submit'
import './styles/App.css'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collabs" element={<Collabs />} />
        <Route path="/collabs/:id" element={<CollabDetail />} />
        <Route path="/submit" element={<Submit />} />
      </Routes>
    </Layout>
  )
}

export default App
