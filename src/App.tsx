
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/Home'
import RestaurantOrderingSystemPage from './pages/RestaurantOrderingSystem.tsx'
import LuaRoverPage from './pages/LuaRover.tsx'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:sectionId" element={<HomePage />} />
        <Route path="/restaurant-ordering-system" element={<RestaurantOrderingSystemPage />} />
        <Route path="/lua-rover" element={<LuaRoverPage />} />
      </Routes>
    </Layout>
  )
}


export default App

