import { useEffect, useState, useRef } from 'react'
import { buildSearchUrl } from '../services/api'
import { useFetch } from '../hooks/useFetch'
import { useNavigate } from 'react-router-dom'
import MovieCard from '../components/MovieCard'
import Header from '../components/Header'

type OmdbMovie = {
  imdbID: string
  Title: string
  Year: string
  Poster: string
}

type SearchResult = { Search?: OmdbMovie[]; totalResults?: string; Response: string; Error?: string }

export default function Search() {
  const [query, setQuery] = useState('naruto')
  const [page, setPage] = useState(1)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const url = query ? buildSearchUrl(query, page) : null
  const { data, loading, error } = useFetch<SearchResult>(url, [url])
  const navigate = useNavigate()

  useEffect(() => { setPage(1) }, [query])
  useEffect(() => { inputRef.current?.focus() }, [])

  const results = data?.Search || []
  const total = Number(data?.totalResults || 0)
  const maxPage = total ? Math.ceil(total / 10) : 0

  function handleOpenDetails(imdbID: string) {
    // Toujours ouvrir la fiche OMDb (même connecté)
    navigate(`/details/${imdbID}`)
  }

  return (
    <div>
      <Header title="Recherche" />
      <div className="input-row">
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') setPage(1) }}
          placeholder="Titre de film..."
        />
        <button onClick={() => { setPage(1); inputRef.current?.focus() }}>Rechercher</button>
      </div>

      {loading && <p>Chargement…</p>}
      {error && <p>Erreur: {error}</p>}

      {!loading && !error && results.length === 0 && (
        <p className="empty">Aucun résultat.</p>
      )}

      <div className="grid">
        {results.map(m => (
          <MovieCard
            key={m.imdbID}
            movie={m}
            onOpen={(id) => handleOpenDetails(id)}
          />
        ))}
      </div>

      {maxPage > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Précédent</button>
          <span>Page {page} / {maxPage}</span>
          <button disabled={page >= maxPage} onClick={() => setPage(p => p + 1)}>Suivant</button>
        </div>
      )}
    </div>
  )
}
