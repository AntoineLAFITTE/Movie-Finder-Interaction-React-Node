import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { http } from "../services/http";

type PublicUser = { _id: string; username: string; createdAt: string };

export default function Users() {
  const [items, setItems] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await http.get<{ items: PublicUser[] }>("/api/users");
        setItems(data.items);
      } catch (e: any) {
        setError(e.message || "Erreur");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <Header title="Utilisateurs" />
      {loading && <p>Chargement…</p>}
      {error && <p>Erreur: {error}</p>}

      {!loading && !error && (
        <div className="card">
          <div className="body">
            {items.length === 0 && <p className="empty">Aucun utilisateur.</p>}
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {items.map(u => (
                <li key={u._id}>
                  <Link to={`/users/${u.username}`}>@{u.username}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
