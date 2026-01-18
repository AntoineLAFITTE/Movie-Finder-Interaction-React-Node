import { useNavigate, useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import DetailsCard from "../components/DetailsCard";

type OmdbMovie = {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Plot?: string;
  Genre?: string;
  Runtime?: string;
  imdbRating?: string;
  Response?: string;
  Error?: string;
};

type DbMovie = {
  _id: string;
  imdbID?: string;
  title: string;
  year?: string;
  poster?: string;
  description?: string;
};

function isObjectId(id: string) {
  return /^[a-fA-F0-9]{24}$/.test(id);
}

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) return <p>Identifiant manquant.</p>;

  // IMPORTANT : pour toujours passer par le backend (proxy /api)
  const omdbUrl = !isObjectId(id) ? `/api/omdb/${id}` : null;
  const dbUrl = isObjectId(id) ? `/api/movies/${id}` : null;

  const omdb = useFetch<OmdbMovie>(omdbUrl, [omdbUrl]);
  const db = useFetch<DbMovie>(dbUrl, [dbUrl]);

  const loading = omdb.loading || db.loading;
  const error = omdb.error || db.error;

  // si OMDb renvoie Response False, on l’affiche comme erreur propre
  const omdbData = omdb.data && (omdb.data as any).Response === "False" ? null : omdb.data;

  return (
    <div>
      <header>
        <h2>Détails</h2>
      </header>

      {loading && <p>Chargement…</p>}
      {error && <p>Erreur: {error}</p>}

      {/* OMDb */}
      {omdbData && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 300px) 1fr", gap: 16 }}>
            <div>
              <DetailsCard movie={omdbData as any} />
            </div>

            <div className="card">
              <div className="body">
                <div className="row">
                  <strong>{omdbData.Title}</strong>
                  <span className="badge">{omdbData.Year}</span>
                </div>
                {omdbData.Plot && <p>{omdbData.Plot}</p>}
                <small>
                  {omdbData.Genre ? `${omdbData.Genre} - ` : ""}
                  {omdbData.Runtime ? `${omdbData.Runtime} - ` : ""}
                  {omdbData.imdbRating ? `Note ${omdbData.imdbRating}` : ""}
                </small>

                <div className="row" style={{ marginTop: 12 }}>
                  <button onClick={() => navigate(-1)}>Retour</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DB */}
      {db.data && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 300px) 1fr", gap: 16 }}>
            <div>
              <DetailsCard movie={db.data as any} />
            </div>

            <div className="card">
              <div className="body">
                <div className="row">
                  <strong>{db.data.title}</strong>
                  {db.data.year && <span className="badge">{db.data.year}</span>}
                </div>

                {db.data.description && <p>{db.data.description}</p>}

                <div className="row" style={{ marginTop: 12 }}>
                  <button onClick={() => navigate(-1)}>Retour</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* si on a ni OMDb ni DB et pas d'erreur fetch, on peut montrer un fallback */}
      {!loading && !error && !omdbData && !db.data && <p className="empty">Introuvable.</p>}
    </div>
  );
}
