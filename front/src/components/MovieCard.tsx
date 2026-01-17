import { useState } from "react";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import { importMovie } from "../services/movies";

type OmdbMovie = {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
};

type DbMovie = {
  _id: string;
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
  const { isFavorite, toggleFavorite } = useFavorites();
  const [busy, setBusy] = useState(false);

  const db = isDbMovie(movie);

  const id = db ? movie._id : movie.imdbID;
  const title = db ? movie.title : movie.Title;
  const year = db ? movie.year ?? "" : movie.Year;
  const poster = db ? movie.poster ?? "N/A" : movie.Poster;

  const fav = db ? isFavorite(movie._id) : false;

  async function handleFavoriteClick() {
    // DB movie => toggle direct
    if (db) {
      await toggleFavorite(movie._id);
      return;
    }

    // OMDb movie => import puis toggle (si connecté)
    if (!user) return;

    setBusy(true);
    try {
      const dbMovie = await importMovie(movie.imdbID);
      await toggleFavorite(dbMovie._id);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <img
        src={poster !== "N/A" && poster ? poster : "https://placehold.co/300x450?text=No+Poster"}
        alt={title}
      />
      <div className="body">
        <div className="row">
          <strong>{title}</strong>
          {year && <span className="badge">{year}</span>}
        </div>

        <div className="row">
          <button
            onClick={handleFavoriteClick}
            disabled={busy || (!db && !user)}
            title={!db && !user ? "Connecte-toi pour ajouter en favoris" : ""}
          >
            {busy ? "..." : db ? (fav ? "★ Retirer" : "☆ Favori") : "☆ Favori"}
          </button>

          {onOpen && <button onClick={() => onOpen(id)}>Détails</button>}
        </div>
      </div>
    </div>
  );
}
