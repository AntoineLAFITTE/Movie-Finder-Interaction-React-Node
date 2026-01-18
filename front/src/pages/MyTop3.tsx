import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { useTop3Draft } from "../context/Top3DraftContext";
import { createTop3, deleteTop3, listMyTop3, type OmdbMini, type Top3 } from "../services/top3";

function emptyMovie(): OmdbMini {
  return { imdbID: "", Title: "", Year: "", Poster: "" };
}

export default function MyTop3() {
  const { user } = useAuth();
  const { selected, clear } = useTop3Draft();

  const [items, setItems] = useState<Top3[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [v, setV] = useState<"public" | "private">("public");

  const [m1, setM1] = useState<OmdbMini>(emptyMovie());
  const [m2, setM2] = useState<OmdbMini>(emptyMovie());
  const [m3, setM3] = useState<OmdbMini>(emptyMovie());

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

  // charge mes Top3
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // sync live: les champs reflètent toujours selected
  useEffect(() => {
    setM1((selected?.[0] as OmdbMini) ?? emptyMovie());
    setM2((selected?.[1] as OmdbMini) ?? emptyMovie());
    setM3((selected?.[2] as OmdbMini) ?? emptyMovie());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const movies = useMemo(() => [m1, m2, m3], [m1, m2, m3]);

  const canCreate = useMemo(() => {
    if (!title.trim()) return false;
    for (const m of movies) {
      if (!m.imdbID.trim() || !m.Title.trim()) return false;
    }
    return true;
  }, [title, movies]);

  function clearSelectionAndFields() {
    clear(); // vide le draft -> déclenche aussi le useEffect qui reset m1/m2/m3
    setM1(emptyMovie());
    setM2(emptyMovie());
    setM3(emptyMovie());
  }

  async function onCreate() {
    setError(null);

    if (!canCreate) {
      return setError("Complète le titre + imdbID et Title pour les 3 films.");
    }

    try {
      await createTop3({ title: title.trim(), movies, visibility: v });

      // reset le form
      setTitle("");
      setM1(emptyMovie());
      setM2(emptyMovie());
      setM3(emptyMovie());

      // clear la sélection de la draft du top3
      clear();

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
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre (ex: Top 3 Action Movies)"
            />
            <select value={v} onChange={(e) => setV(e.target.value as any)}>
              <option value="public">public</option>
              <option value="private">private</option>
            </select>
            <button
              onClick={onCreate}
              disabled={!canCreate}
              title={!canCreate ? "Complète le formulaire" : ""}
            >
              Créer
            </button>
          </div>

          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 12 }}>
            <small style={{ opacity: 0.75 }}>
              Sélection depuis Search: <strong>{selected.length}</strong>/3
            </small>
            {selected.length > 0 && (
              <button onClick={clearSelectionAndFields} style={{ padding: "4px 8px" }}>
                Vider sélection
              </button>
            )}
          </div>

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
