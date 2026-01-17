import { http } from "./http";

export type OmdbMini = {
  imdbID: string;
  Title: string;
  Year?: string;
  Poster?: string;
};

export type Top3 = {
  _id: string;
  title: string;
  movies: OmdbMini[];
  owner?: { _id: string; username: string } | string;
  visibility: "public" | "private";
  createdAt: string;
};

export async function listTop3(page = 1, limit = 12) {
  return http.get<{ page: number; limit: number; total: number; items: Top3[] }>(
    `/api/top3?page=${page}&limit=${limit}`
  );
}

export async function searchTop3(q: string) {
  return http.get<{ items: Top3[] }>(`/api/top3/search?q=${encodeURIComponent(q)}`);
}

export async function getTop3ById(id: string) {
  return http.get<Top3>(`/api/top3/${id}`);
}

export async function createTop3(payload: { title: string; movies: OmdbMini[]; visibility?: "public" | "private" }) {
  return http.post<Top3>(`/api/top3`, payload);
}

export async function deleteTop3(id: string) {
  return http.del<{ message: string }>(`/api/top3/${id}`);
}

export async function listMyTop3() {
  return http.get<{ items: Top3[] }>(`/api/me/top3`);
}
