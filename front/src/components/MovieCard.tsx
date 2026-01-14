import  type { Movie } from '../context/FavoritesContext'
import { useFavorites } from '../context/FavoritesContext'

type Props = {
  movie: Movie
  onOpen?: (id: string) => void
}

export default function MovieCard({ movie, onOpen }: Props) {
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
        <div className="row">
          <button onClick={() => toggleFavorite(movie)}>{fav ? '★ Retirer' : '☆ Favori'}</button>
          {onOpen && <button onClick={() => onOpen(movie.imdbID)}>Détails</button>}
        </div>
      </div>
    </div>
  )
}
