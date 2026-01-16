import { Link, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Search from './pages/Search'
import Favorites from './pages/Favorites'
import Details from './pages/Details'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'
import { useTheme } from './context/ThemeContext'
import { useAuth } from './context/AuthContext'

export default function App() {
  const { dark, toggleDark } = useTheme()
  const { user, logout, isLoading } = useAuth()
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

            {!isLoading && user ? (
              <>
                <span style={{ marginLeft: 8 }}>@{user.username}</span>
                <button
                  onClick={() => logout()}
                  style={{ marginLeft: 8 }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={loc.pathname === '/login' ? 'active' : ''}>Login</Link>
                <Link to="/register" className={loc.pathname === '/register' ? 'active' : ''}>Register</Link>
              </>
            )}

            <button onClick={toggleDark}>{dark ? '☀️ Clair' : '🌙 Sombre'}</button>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/details/:id" element={<Details />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  )
}
