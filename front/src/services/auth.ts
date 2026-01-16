import { http } from "./http";
import { setAccessToken } from "./http";

export type User = {
  id?: string;
  _id?: string;
  username: string;
  email?: string;
  createdAt?: string;
};

export async function register(username: string, email: string, password: string) {
  const data = await http.post<{ user: User; accessToken: string }>("/api/auth/register", {
    username,
    email,
    password,
  });
  setAccessToken(data.accessToken);
  return data.user;
}

export async function login(email: string, password: string) {
  const data = await http.post<{ user: User; accessToken: string }>("/api/auth/login", {
    email,
    password,
  });
  setAccessToken(data.accessToken);
  return data.user;
}

export async function logout() {
  try {
    await http.post<{ message: string }>("/api/auth/logout");
  } finally {
    setAccessToken(null);
  }
}

export async function me() {
  const data = await http.get<{ user: User }>("/api/me");
  return data.user;
}
