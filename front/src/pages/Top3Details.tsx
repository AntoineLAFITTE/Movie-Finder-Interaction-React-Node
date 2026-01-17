import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import { getTop3ById, type Top3 as Top3Type } from "../services/top3";

export default function Top3Details() {
  const { id } = useParams();
  const [item, setItem] = useState<Top3Type | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const d = await getTop3ById(id);
        setItem(d);
      } catch (e: any) {
        setError(e.message || "Erreur");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <div>
      <Header title="Top 3" />
      {loading && <p>Chargement…</p>}
      {error && <p>Erreur: {error}</p>}

      {item && (
        <div className="card">
          <div className="body">
            <div className="row">
              <strong>{item.title}</strong>
              {typeof item.owner !== "string" && item.owner?.username && (
                <Link to={`/users/${item.owner.username}`}>@{item.owner.username}</Link>
              )}
            </div>

            <div className="grid" style={{ marginTop: 12 }}>
              {item.movies.map((m) => (
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
                    <small>{m.imdbID}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
