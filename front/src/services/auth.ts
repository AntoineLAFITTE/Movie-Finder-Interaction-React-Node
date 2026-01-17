import { http } from "./http";

export type User = {
  id?: string;
  _id?: string;
  username: string;
  email?: string;
  createdAt?: string;
};

type AuthResponse = {
  user: User;
  accessToken: string;
};

// Ne plus stocker le token ici
export async function register(
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  return http.post<AuthResponse>("/api/auth/register", {
    username,
    email,
    password,
  });
}

// Token a ne pas stocké ici non plsu
export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  return http.post<AuthResponse>("/api/auth/login", {
    email,
    password,
  });
}

export async function logout() {
  return http.post<{ message: string }>("/api/auth/logout");
}

export async function me(): Promise<User> {
  const data = await http.get<{ user: User }>("/api/me");
  return data.user;
}
