import { Link, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Search from './pages/Search'
import Favorites from './pages/Favorites'
import Details from './pages/Details'
import Home from './pages/Home'
import { useTheme } from './context/ThemeContext'

export default function App() {
  const { dark, toggleDark } = useTheme()
  const loc = useLocation()

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="container">
        <nav>
          <div className="row">
            <h1>Movie Finder</h1>
          </div>
          <div className="links">
            <Link to="/search" className={loc.pathname === '/search' ? 'active' : ''}>Recherche</Link>
            <Link to="/favorites" className={loc.pathname === '/favorites' ? 'active' : ''}>Favoris</Link>
            <button onClick={toggleDark}>{dark ? '☀️ Clair' : '🌙 Sombre'}</button>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/details/:id" element={<Details />} />
        </Routes>
      </div>
    </div>
  )
}
