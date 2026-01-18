import { useState } from "react";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import { importMovie } from "../services/movies";

type OmdbMovie = {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Plot?: string;
  Genre?: string;
  Runtime?: string;
  imdbRating?: string;
};

type DbMovie = {
  _id: string;
  imdbID?: string;
  title: string;
  year?: string;
  poster?: string;
  description?: string;
};

type Props = {
  movie: OmdbMovie | DbMovie;
};

function isDbMovie(m: OmdbMovie | DbMovie): m is DbMovie {
  return (m as DbMovie)._id !== undefined;
}

export default function DetailsCard({ movie }: Props) {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [busy, setBusy] = useState(false);

  const db = isDbMovie(movie);

  const title = db ? movie.title : movie.Title;
  const year = db ? movie.year ?? "" : movie.Year;
  const poster = db ? movie.poster ?? "N/A" : movie.Poster;

  const fav = db ? isFavorite(movie._id) : false;

  async function handleToggleFavorite() {
    if (busy) return;

    // DB => toggle direct
    if (db) {
      setBusy(true);
      try {
        await toggleFavorite(movie._id);
      } finally {
        setBusy(false);
      }
      return;
    }

    // OMDb => import puis toggle (si connecté)
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

        <div className="row" style={{ marginTop: 8 }}>
          <button
            onClick={handleToggleFavorite}
            disabled={busy || (!db && !user)}
            title={!db && !user ? "Connecte-toi pour ajouter en favoris" : ""}
          >
            {busy ? "..." : db ? (fav ? "★ Retirer" : "☆ Favori") : "☆ Favori"}
          </button>
        </div>
      </div>
    </div>
  );
}
