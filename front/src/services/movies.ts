import { http } from "./http";

export type DbMovie = {
  _id: string;
  imdbID?: string;
  title: string;
  year?: string;
  poster?: string;
  description?: string;
};

export async function importMovie(imdbID: string) {
  const movie = await http.post<DbMovie>("/api/movies/import", { imdbID });
  return movie;
}
