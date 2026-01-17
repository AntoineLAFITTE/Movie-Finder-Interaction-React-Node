import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import { http } from "../services/http";

type OmdbMini = { imdbID: string; Title: string; Year?: string; Poster?: string };
type Top3 = { _id: string; title: string; movies: OmdbMini[]; createdAt: string };

type DbMovieMini = { _id: string; title: string; year?: string; poster?: string; createdAt: string };

type ProfileResponse = {
  user: { _id: string; username: string; createdAt: string };
  movies: DbMovieMini[];
  top3: Top3[];
};

export default function UserProfile() {
  const { username } = useParams();
  const [data, setData] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;
    (async () => {
      try {
        const d = await http.get<ProfileResponse>(`/api/users/${username}`);
        setData(d);
      } catch (e: any) {
        setError(e.message || "Erreur");
      } finally {
        setLoading(false);
      }
    })();
  }, [username]);

  return (
    <div>
      <Header title={`Profil @${username || ""}`} />
      {loading && <p>Chargement…</p>}
      {error && <p>Erreur: {error}</p>}

      {data && (
        <>
          <div className="card">
            <div className="body">
              <p style={{ margin: 0 }}>
                <strong>@{data.user.username}</strong>
              </p>
              <small>Créé le {new Date(data.user.createdAt).toLocaleDateString()}</small>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <h3>Top 3 publics</h3>
            {data.top3.length === 0 && <p className="empty">Aucun Top 3 public.</p>}
            {data.top3.map(t => (
              <div key={t._id} className="card" style={{ marginBottom: 12 }}>
                <div className="body">
                  <div className="row">
                    <strong>{t.title}</strong>
                    <Link to={`/top3/${t._id}`}>Voir</Link>
                  </div>
                  <div className="grid">
                    {t.movies.map(m => (
                      <div key={m.imdbID} className="card">
                        <img
                          src={m.Poster && m.Poster !== "N/A" ? m.Poster : "https://placehold.co/300x450?text=No+Poster"}
                          alt={m.Title}
                        />
                        <div className="body">
                          <div className="row">
                            <strong>{m.Title}</strong>
                            {m.Year && <span className="badge">{m.Year}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12 }}>
            <h3>Movies publics</h3>
            {data.movies.length === 0 && <p className="empty">Aucun movie public.</p>}
            <div className="grid">
              {data.movies.map(m => (
                <div key={m._id} className="card">
                  <img
                    src={m.poster && m.poster !== "N/A" ? m.poster : "https://placehold.co/300x450?text=No+Poster"}
                    alt={m.title}
                  />
                  <div className="body">
                    <div className="row">
                      <strong>{m.title}</strong>
                      {m.year && <span className="badge">{m.year}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
