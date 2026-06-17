const BASE = import.meta.env.VITE_API_URL ?? "";

export function getToken(): string | null {
  return localStorage.getItem("mumy_token");
}

export function setToken(token: string): void {
  localStorage.setItem("mumy_token", token);
}

export function clearAuth(): void {
  localStorage.removeItem("mumy_token");
  localStorage.removeItem("mumy_user");
}

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return fetch(`${BASE}${path}`, { ...init, headers });
}
