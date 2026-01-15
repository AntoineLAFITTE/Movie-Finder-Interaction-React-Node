const API_BASE = '/api/omdb'

// Recherche de films (par le titre)
export function buildSearchUrl(query: string, page: number = 1): string {
  const q = encodeURIComponent(query)
  return `${API_BASE}/search?q=${q}&page=${page}`
}

// Détails d’un film (par ID IMDb)
export function buildDetailsUrl(imdbID: string): string {
  return `${API_BASE}/${encodeURIComponent(imdbID)}`
}
