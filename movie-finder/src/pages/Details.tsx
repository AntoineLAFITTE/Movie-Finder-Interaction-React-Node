import { useNavigate, useParams } from 'react-router-dom'
import { buildDetailsUrl } from '../services/api'
import { useFetch } from '../hooks/useFetch'
import type { Movie } from '../context/FavoritesContext'
import DetailsCard from '../components/DetailsCard'

type DetailsResult = Movie & { Plot: string; Genre: string; Runtime: string; imdbRating: string }

export default function Details() {
  const { id } = useParams()
  const navigate = useNavigate()
  const url = id ? buildDetailsUrl(id) : null
  const { data, loading, error } = useFetch<DetailsResult>(url, [url])

  if (!id) return <p>Identifiant manquant.</p>

  return (
    <div>
      <header>
        <h2>Détails</h2>
      </header>

      {loading && <p>Chargement…</p>}
      {error && <p>Erreur: {error}</p>}

      {data && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 300px) 1fr', gap: 16 }}>
            <div>
              <DetailsCard movie={data} />
            </div>

            <div className="card">
              <div className="body">
                <div className="row"><strong>{data.Title}</strong><span className="badge">{data.Year}</span></div>
                <p>{data.Plot}</p>
                <small>{data.Genre} - {data.Runtime} - Note {data.imdbRating}</small>
                <div className="row" style={{ marginTop: 12 }}>
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
