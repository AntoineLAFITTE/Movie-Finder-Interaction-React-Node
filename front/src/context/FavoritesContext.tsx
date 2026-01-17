import { createContext, useContext, useEffect, useMemo, useCallback, useState } from "react";
import type { ReactNode } from "react";
import { http } from "../services/http";
import { useAuth } from "./AuthContext";

// Movie venant de ta DB (back)
export type DbMovie = {
  _id: string;
  title: string;
  year?: string;
  poster?: string;
  description?: string;
  owner?: { _id: string; username: string } | string;
  visibility?: string;
  createdAt?: string;
};

type FavoritesContextType = {
  favorites: DbMovie[];
  refreshFavorites: () => Promise<void>;
  toggleFavorite: (movieId: string) => Promise<void>;
  isFavorite: (movieId: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const [favorites, setFavorites] = useState<DbMovie[]>([]);

  const refreshFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      return;
    }
    const data = await http.get<{ items: DbMovie[] }>("/api/me/favorites");
    setFavorites(data.items || []);
  }, [user]);

  // Recharge les favoris quand on se connecte / déconnecte
  useEffect(() => {
    if (isLoading) return;
    refreshFavorites();
  }, [isLoading, user, refreshFavorites]);

  const favoriteIds = useMemo(() => new Set(favorites.map((m) => m._id)), [favorites]);

  const isFavorite = useCallback(
    (movieId: string) => {
      return favoriteIds.has(movieId);
    },
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    async (movieId: string) => {
      if (!user) return;

      if (favoriteIds.has(movieId)) {
        await http.del(`/api/favorites/${movieId}`);
      } else {
        await http.post(`/api/favorites/${movieId}`);
      }
      await refreshFavorites();
    },
    [user, favoriteIds, refreshFavorites]
  );

  return (
    <FavoritesContext.Provider value={{ favorites, refreshFavorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
