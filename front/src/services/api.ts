const API_BASE = 'https://www.omdbapi.com/'
const API_KEY = 'thewdb' // voir si ill faut une clé perso ?

// Recherche de films (par le titre)
export function buildSearchUrl(query: string, page: number = 1): string {
  const q = encodeURIComponent(query)
  return `${API_BASE}?apikey=${API_KEY}&type=movie&s=${q}&page=${page}`
}

// Détails d’un film (par ID IMDb)
export function buildDetailsUrl(imdbID: string): string {
  return `${API_BASE}?apikey=${API_KEY}&i=${imdbID}`
}
