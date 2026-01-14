import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'
import type { ReactNode } from 'react'

export type Movie = {
  imdbID: string
  Title: string
  Year: string
  Poster: string
}

type FavoritesContextType = {
  favorites: Movie[]
  toggleFavorite: (movie: Movie) => void
  isFavorite: (id: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Movie[]>([])


  useEffect(() => {
    try {
      const raw = localStorage.getItem('mfavorites')
      if (raw) setFavorites(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem('mfavorites', JSON.stringify(favorites))
  }, [favorites])



  function toggleFavorite(movie: Movie) {
    setFavorites(prev => {
      const exists = prev.some(m => m.imdbID === movie.imdbID)
      return exists ? prev.filter(m => m.imdbID !== movie.imdbID) : [...prev, movie]
    })
  }

  const favoriteIds = useMemo(() => new Set(favorites.map(m => m.imdbID)), [favorites])

  const isFavorite = useCallback((id: string) => {
    return favoriteIds.has(id)
  }, [favoriteIds])

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}
