import type { WeatherResponse, GeocodingResponse, Favorite, Recommendation } from '../types/weather';

const API_BASE = '/api';

export async function fetchWeather(lat: number, lon: number): Promise<WeatherResponse> {
  const res = await fetch(`${API_BASE}/weather?lat=${lat}&lon=${lon}`);
  if (!res.ok) throw new Error('Failed to fetch weather');
  return res.json();
}

export async function searchLocations(query: string): Promise<GeocodingResponse> {
  const res = await fetch(`${API_BASE}/geocoding?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Failed to search locations');
  return res.json();
}

export async function getFavorites(): Promise<Favorite[]> {
  const res = await fetch(`${API_BASE}/favorites`);
  if (!res.ok) throw new Error('Failed to fetch favorites');
  return res.json();
}

export async function addFavorite(fav: {
  name: string;
  latitude: number;
  longitude: number;
  country: string | null;
}): Promise<Favorite> {
  const res = await fetch(`${API_BASE}/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fav),
  });
  if (!res.ok) throw new Error('Failed to add favorite');
  return res.json();
}

export async function removeFavorite(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/favorites/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to remove favorite');
}

export async function fetchRecommendations(lat: number, lon: number): Promise<Recommendation> {
  const res = await fetch(`${API_BASE}/recommendations?lat=${lat}&lon=${lon}`);
  if (!res.ok) throw new Error('Failed to fetch recommendations');
  return res.json();
}
