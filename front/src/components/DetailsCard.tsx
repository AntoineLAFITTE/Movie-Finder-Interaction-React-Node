import type { Movie } from '../context/FavoritesContext'
import { useFavorites } from '../context/FavoritesContext'

type Props = {
  movie: Movie & { Plot?: string; Genre?: string; Runtime?: string; imdbRating?: string }
}

export default function DetailsCard({ movie }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const fav = isFavorite(movie.imdbID)

  return (
    <div className="card">
      <img src={movie.Poster !== 'N/A' ? movie.Poster : 'https://placehold.co/300x450?text=No+Poster'} alt={movie.Title} />
      <div className="body">
        <div className="row">
          <strong>{movie.Title}</strong>
          <span className="badge">{movie.Year}</span>
        </div>
        {movie.Plot && <p>{movie.Plot}</p>}
        <small>{movie.Genre} {movie.Runtime ? `- ${movie.Runtime}` : ''} {movie.imdbRating ? `- Note ${movie.imdbRating}` : ''}</small>
        <div className="row" style={{ marginTop: 8 }}>
          <button onClick={() => toggleFavorite(movie)}>{fav ? '★ Retirer' : '☆ Favori'}</button>
        </div>
      </div>
    </div>
  )
}
