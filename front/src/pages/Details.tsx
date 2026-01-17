import { useNavigate, useParams } from 'react-router-dom'
import { buildDetailsUrl } from '../services/api'
import { useFetch } from '../hooks/useFetch'
import DetailsCard from '../components/DetailsCard'
import { useFavorites } from '../context/FavoritesContext'

type OmdbMovie = {
  imdbID: string
  Title: string
  Year: string
  Poster: string
  Plot: string
  Genre: string
  Runtime: string
  imdbRating: string
}

type DbMovie = {
  _id: string
  imdbID?: string
  title: string
  year?: string
  poster?: string
  description?: string
}

function isObjectId(id: string) {
  return /^[a-fA-F0-9]{24}$/.test(id)
}

export default function Details() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()

  if (!id) return <p>Identifiant manquant.</p>

  const omdbUrl = !isObjectId(id) ? buildDetailsUrl(id) : null
  const omdb = useFetch<OmdbMovie>(omdbUrl, [omdbUrl])

  const dbUrl = isObjectId(id) ? `/api/movies/${id}` : null
  const db = useFetch<DbMovie>(dbUrl, [dbUrl])

  const loading = omdb.loading || db.loading
  const error = omdb.error || db.error
  const dataOmdb = omdb.data
  const dataDb = db.data

  return (
    <div>
      <header>
        <h2>Détails</h2>
      </header>

      {loading && <p>Chargement…</p>}
      {error && <p>Erreur: {error}</p>}

      {dataOmdb && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 300px) 1fr', gap: 16 }}>
            <div>
              <DetailsCard movie={dataOmdb as any} />
            </div>

            <div className="card">
              <div className="body">
                <div className="row"><strong>{dataOmdb.Title}</strong><span className="badge">{dataOmdb.Year}</span></div>
                <p>{dataOmdb.Plot}</p>
                <small>{dataOmdb.Genre} - {dataOmdb.Runtime} - Note {dataOmdb.imdbRating}</small>
                <div className="row" style={{ marginTop: 12 }}>
                  <button onClick={() => navigate(-1)}>Retour</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {dataDb && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 300px) 1fr', gap: 16 }}>
            <div>
              <img
                src={dataDb.poster && dataDb.poster !== "N/A" ? dataDb.poster : "https://placehold.co/300x450?text=No+Poster"}
                style={{ width: "100%", borderRadius: 12 }}
                alt={dataDb.title}
              />
            </div>

            <div className="card">
              <div className="body">
                <div className="row">
                  <strong>{dataDb.title}</strong>
                  {dataDb.year && <span className="badge">{dataDb.year}</span>}
                </div>

                {dataDb.description && <p>{dataDb.description}</p>}

                <div className="row" style={{ marginTop: 12 }}>
                  <button onClick={() => toggleFavorite(dataDb._id)}>
                    {isFavorite(dataDb._id) ? "★ Retirer" : "☆ Favori"}
                  </button>
                  <button onClick={() => navigate(-1)}>Retour</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
