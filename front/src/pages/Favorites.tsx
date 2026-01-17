import MovieCard from "../components/MovieCard";
import Header from "../components/Header";
import { useFavorites } from "../context/FavoritesContext";

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <div>
      <Header title="Mes favoris" />
      {favorites.length === 0 && <p className="empty">Aucun favori pour l’instant.</p>}
      <div className="grid">
        {favorites.map((m) => (
          <MovieCard key={m._id} movie={m} />
        ))}
      </div>
    </div>
  );
}
