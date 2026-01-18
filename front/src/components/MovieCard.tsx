import { useState } from "react";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import { importMovie } from "../services/movies";
import { useTop3Draft } from "../context/Top3DraftContext";

type OmdbMovie = {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
};

type DbMovie = {
  _id: string;
  imdbID?: string;
  title: string;
  year?: string;
  poster?: string;
};

type MovieAny = OmdbMovie | DbMovie;

type Props = {
  movie: MovieAny;
  onOpen?: (id: string) => void;
};

function isDbMovie(m: MovieAny): m is DbMovie {
  return (m as DbMovie)._id !== undefined;
}

export default function MovieCard({ movie, onOpen }: Props) {
  const { user } = useAuth();
  const { favorites, isFavorite, isFavoriteImdb, toggleFavorite } = useFavorites();
  const { add, isSelected, selected } = useTop3Draft();
  const [busy, setBusy] = useState(false);

  const db = isDbMovie(movie);

  const id = db ? movie._id : movie.imdbID;
  const title = db ? movie.title : movie.Title;
  const year = db ? movie.year ?? "" : movie.Year;
  const poster = db ? movie.poster ?? "N/A" : movie.Poster;

  // IMPORTANT: pour OMDb, on check via imdbID dans favorites
  const fav = db
    ? isFavorite(movie._id)
    : user
      ? isFavoriteImdb(movie.imdbID)
      : false;

  async function handleFavoriteClick() {
    // DB movie => toggle direct
    if (db) {
      await toggleFavorite(movie._id);
      return;
    }

    // OMDb movie => si pas connecté => rien
    if (!user) return;

    setBusy(true);
    try {
      // si déjà en favoris (via imdbID), on  supprimele Movie DB correspondant
      const existing = favorites.find((f) => f.imdbID === movie.imdbID);
      if (existing) {
        await toggleFavorite(existing._id); // ça fera DELETE
        return;
      }

      // sinon import puis add
      const dbMovie = await importMovie(movie.imdbID);
      await toggleFavorite(dbMovie._id); // ça fera POST
    } finally {
      setBusy(false);
    }
  }

  function handleAddTop3() {
    if (db) return;
    if (!user) return;

    add({
      imdbID: movie.imdbID,
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
    });
  }

  const top3Disabled =
    !user || db || selected.length >= 3 || isSelected(!db ? movie.imdbID : "");

  const top3Label = !user
    ? "Connecte-toi pour créer un Top3"
    : selected.length >= 3
      ? "Top3 complet (3/3)"
      : isSelected(!db ? movie.imdbID : "")
        ? "Déjà dans le Top3"
        : "Ajouter au Top3";

  return (
    <div className="card">
      <img
        src={
          poster !== "N/A" && poster
            ? poster
            : "https://placehold.co/300x450?text=No+Poster"
        }
        alt={title}
      />
      <div className="body">
        <div className="row">
          <strong>{title}</strong>
          {year && <span className="badge">{year}</span>}
        </div>

        {/* affiche imdbID pour les films OMDb */}
        {!db && (
          <small style={{ opacity: 0.65 }}>imdbID: {movie.imdbID}</small>
        )}

        <div className="row" style={{ marginTop: 8 }}>
          <button
            onClick={handleFavoriteClick}
            disabled={busy || (!db && !user)}
            title={!db && !user ? "Connecte-toi pour ajouter en favoris" : ""}
          >
            {busy ? "..." : fav ? "★ Retirer" : "☆ Favori"}
          </button>

          {/* bouton Top3 depuis Search */}
          {!db && user && (
            <button onClick={handleAddTop3} disabled={top3Disabled} title={top3Label}>
              {isSelected(movie.imdbID) ? "✅ Top3" : "➕ Top3"}
            </button>
          )}

          {onOpen && <button onClick={() => onOpen(id)}>Détails</button>}
        </div>
      </div>
    </div>
  );
}
