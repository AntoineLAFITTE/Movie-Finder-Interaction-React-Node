import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { listTop3, searchTop3, type Top3 as Top3Type } from "../services/top3";

export default function Top3() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Top3Type[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canSearch = useMemo(() => q.trim().length > 0, [q]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        if (canSearch) {
          const r = await searchTop3(q.trim());
          setItems(r.items);
        } else {
          const r = await listTop3(1, 12);
          setItems(r.items);
        }
      } catch (e: any) {
        setError(e.message || "Erreur");
      } finally {
        setLoading(false);
      }
    })();
  }, [canSearch, q]);

  return (
    <div>
      <Header title="Top 3 publics" />

      <div className="input-row">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher un Top 3 (ex: action)…"
        />
        <button onClick={() => setQ(q.trim())}>Rechercher</button>
      </div>

      {loading && <p>Chargement…</p>}
      {error && <p>Erreur: {error}</p>}

      {!loading && !error && items.length === 0 && <p className="empty">Aucun Top 3.</p>}

      <div className="grid">
        {items.map((t) => {
          const ownerUsername =
            typeof t.owner === "string" ? "" : t.owner?.username || "";

          return (
            <div key={t._id} className="card">
              <div className="body">
                <div className="row">
                  <strong>{t.title}</strong>
                  <Link to={`/top3/${t._id}`}>Voir</Link>
                </div>

                {ownerUsername && (
                  <small>
                    par <Link to={`/users/${ownerUsername}`}>@{ownerUsername}</Link>
                  </small>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
