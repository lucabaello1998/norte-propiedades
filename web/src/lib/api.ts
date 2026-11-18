const API_URL = process.env.API_URL ?? "http://localhost:3002";

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`La API respondió ${response.status} en ${path}`);
  }
  return (await response.json()) as T;
}

export async function apiGetOr<T>(path: string, fallback: T): Promise<T> {
  try {
    return await apiGet<T>(path);
  } catch (error) {
    console.error(error);
    return fallback;
  }
}
