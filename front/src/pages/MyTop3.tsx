import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { createTop3, deleteTop3, listMyTop3, type OmdbMini, type Top3 } from "../services/top3";

export default function MyTop3() {
  const { user } = useAuth();

  const [items, setItems] = useState<Top3[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [v, setV] = useState<"public" | "private">("public");

  const [m1, setM1] = useState<OmdbMini>({ imdbID: "", Title: "", Year: "", Poster: "" });
  const [m2, setM2] = useState<OmdbMini>({ imdbID: "", Title: "", Year: "", Poster: "" });
  const [m3, setM3] = useState<OmdbMini>({ imdbID: "", Title: "", Year: "", Poster: "" });

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const r = await listMyTop3();
      setItems(r.items);
    } catch (e: any) {
      setError(e.message || "Erreur");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate() {
    setError(null);

    const movies = [m1, m2, m3];

    if (!title.trim()) return setError("Titre requis");
    for (const m of movies) {
      if (!m.imdbID.trim() || !m.Title.trim()) {
        return setError("Chaque film doit avoir imdbID et Title");
      }
    }

    try {
      await createTop3({ title: title.trim(), movies, visibility: v });
      setTitle("");
      setM1({ imdbID: "", Title: "", Year: "", Poster: "" });
      setM2({ imdbID: "", Title: "", Year: "", Poster: "" });
      setM3({ imdbID: "", Title: "", Year: "", Poster: "" });
      await refresh();
    } catch (e: any) {
      setError(e.message || "Erreur");
    }
  }

  async function onDelete(id: string) {
    try {
      await deleteTop3(id);
      await refresh();
    } catch (e: any) {
      setError(e.message || "Erreur");
    }
  }

  if (!user) {
    return (
      <div>
        <Header title="Mes Top 3" />
        <p className="empty">Connecte-toi pour créer tes Top 3.</p>
      </div>
    );
  }

  return (
    <div>
      <Header title="Mes Top 3" />

      {error && <p>Erreur: {error}</p>}

      <div className="card">
        <div className="body">
          <h3>Créer un Top 3</h3>

          <div className="input-row">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre (ex: Top 3 Action Movies)" />
            <select value={v} onChange={(e) => setV(e.target.value as any)}>
              <option value="public">public</option>
              <option value="private">private</option>
            </select>
            <button onClick={onCreate}>Créer</button>
          </div>

          <small>Astuce: tu peux copier imdbID depuis la page Search (ex: tt0372784).</small>

          <div style={{ marginTop: 12 }}>
            {[m1, m2, m3].map((m, idx) => (
              <div key={idx} className="input-row">
                <input
                  value={m.imdbID}
                  onChange={(e) => {
                    const val = e.target.value;
                    const next = { ...m, imdbID: val };
                    idx === 0 ? setM1(next) : idx === 1 ? setM2(next) : setM3(next);
                  }}
                  placeholder={`Film ${idx + 1} imdbID`}
                />
                <input
                  value={m.Title}
                  onChange={(e) => {
                    const val = e.target.value;
                    const next = { ...m, Title: val };
                    idx === 0 ? setM1(next) : idx === 1 ? setM2(next) : setM3(next);
                  }}
                  placeholder={`Film ${idx + 1} Title`}
                />
                <input
                  value={m.Year || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    const next = { ...m, Year: val };
                    idx === 0 ? setM1(next) : idx === 1 ? setM2(next) : setM3(next);
                  }}
                  placeholder="Year"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <h3>Mes Top 3</h3>
        {loading && <p>Chargement…</p>}
        {!loading && items.length === 0 && <p className="empty">Aucun Top 3 pour l’instant.</p>}

        <div className="grid">
          {items.map((t) => (
            <div key={t._id} className="card">
              <div className="body">
                <div className="row">
                  <strong>{t.title}</strong>
                  <button onClick={() => onDelete(t._id)}>Supprimer</button>
                </div>
                <small>{t.visibility}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
