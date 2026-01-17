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

// Pages pour les Top 3 :
import Users from './pages/Users'
import UserProfile from './pages/UserProfile'
import Top3 from './pages/Top3'
import Top3Details from './pages/Top3Details'
import MyTop3 from './pages/MyTop3'

export default function App() {
  const { dark, toggleDark } = useTheme()
  const { user, logout, isLoading } = useAuth()
  const loc = useLocation()

  const isActive = (path: string) => loc.pathname === path
  const isStartsWith = (path: string) => loc.pathname.startsWith(path)

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="container">
        <nav>
          <div className="row">
            <h1>Movie Finder</h1>
          </div>

          <div className="links">
            <Link to="/search" className={isActive('/search') ? 'active' : ''}>Recherche</Link>

            {/* Public */}
            <Link to="/top3" className={isStartsWith('/top3') ? 'active' : ''}>Top 3</Link>
            <Link to="/users" className={isStartsWith('/users') ? 'active' : ''}>Utilisateurs</Link>

            {/* Protected */}
            <Link to="/favorites" className={isActive('/favorites') ? 'active' : ''}>Favoris</Link>
            {!isLoading && user && (
              <Link to="/my-top3" className={isActive('/my-top3') ? 'active' : ''}>Mes Top 3</Link>
            )}

            {!isLoading && user ? (
              <>
                <span style={{ marginLeft: 8 }}>@{user.username}</span>
                <button onClick={() => logout()} style={{ marginLeft: 8 }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={isActive('/login') ? 'active' : ''}>Login</Link>
                <Link to="/register" className={isActive('/register') ? 'active' : ''}>Register</Link>
              </>
            )}

            <button onClick={toggleDark}>{dark ? '☀️ Clair' : '🌙 Sombre'}</button>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />

          {/* OMDb Search + Details */}
          <Route path="/search" element={<Search />} />
          <Route path="/details/:id" element={<Details />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Public pages */}
          <Route path="/users" element={<Users />} />
          <Route path="/users/:username" element={<UserProfile />} />

          <Route path="/top3" element={<Top3 />} />
          <Route path="/top3/:id" element={<Top3Details />} />

          {/* Protected pages */}
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-top3"
            element={
              <ProtectedRoute>
                <MyTop3 />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  )
}
