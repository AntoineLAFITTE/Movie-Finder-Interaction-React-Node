import React, { createContext, useContext, useMemo, useState } from "react";

export type OmdbMini = {
  imdbID: string;
  Title: string;
  Year?: string;
  Poster?: string;
};

type Top3DraftValue = {
  selected: OmdbMini[];
  add: (movie: OmdbMini) => void;
  remove: (imdbID: string) => void;
  clear: () => void;
  isSelected: (imdbID: string) => boolean;
};

const Ctx = createContext<Top3DraftValue | null>(null);

export function Top3DraftProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<OmdbMini[]>([]);

  function add(movie: OmdbMini) {
    setSelected(prev => {
      if (prev.some(m => m.imdbID === movie.imdbID)) return prev;
      if (prev.length >= 3) return prev; // max 3
      return [...prev, movie];
    });
  }

  function remove(imdbID: string) {
    setSelected(prev => prev.filter(m => m.imdbID !== imdbID));
  }

  function clear() {
    setSelected([]);
  }

  function isSelected(imdbID: string) {
    return selected.some(m => m.imdbID === imdbID);
  }

  const value = useMemo(() => ({ selected, add, remove, clear, isSelected }), [selected]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTop3Draft() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTop3Draft must be used within Top3DraftProvider");
  return ctx;
}
