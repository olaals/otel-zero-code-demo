import { useState, useEffect, useCallback } from 'react';
import { Typography, CircularProgress, Button, Icon } from '@equinor/eds-core-react';
import { star_filled, star_outlined } from '@equinor/eds-icons';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { CurrentWeather } from '../components/CurrentWeather';
import { ForecastTable } from '../components/ForecastTable';
import { fetchWeather, getFavorites, addFavorite, removeFavorite } from '../api/weatherApi';
import type { WeatherResponse, Favorite } from '../types/weather';

const Content = styled.main`
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BackLink = styled.button`
  background: none;
  border: none;
  color: #007079;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    text-decoration: underline;
  }
`;

const LoadingWrap = styled.div`
  display: flex;
  justify-content: center;
  padding: 48px 0;
`;

export function WeatherPage() {
  const { lat, lon } = useParams<{ lat: string; lon: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const locationName = searchParams.get('name') ?? 'Unknown location';

  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  const latitude = parseFloat(lat ?? '0');
  const longitude = parseFloat(lon ?? '0');

  const isFavorite = favorites.some(
    (f) => Math.abs(f.latitude - latitude) < 0.01 && Math.abs(f.longitude - longitude) < 0.01
  );

  const loadFavorites = useCallback(async () => {
    try {
      const favs = await getFavorites();
      setFavorites(favs);
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  useEffect(() => {
    if (!lat || !lon) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchWeather(latitude, longitude);
        setWeather(data);
      } catch {
        setError('Failed to load weather data. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, [lat, lon, latitude, longitude]);

  const handleToggleFavorite = async () => {
    if (isFavorite) {
      const fav = favorites.find(
        (f) => Math.abs(f.latitude - latitude) < 0.01 && Math.abs(f.longitude - longitude) < 0.01
      );
      if (fav) await removeFavorite(fav.id);
    } else {
      await addFavorite({
        name: locationName,
        latitude,
        longitude,
        country: null,
      });
    }
    await loadFavorites();
  };

  return (
    <Content>
      <TopRow>
        <BackLink onClick={() => navigate('/')}>
          &larr; Back to Home
        </BackLink>
        <Button
          variant="outlined"
          onClick={handleToggleFavorite}
        >
          <Icon
            data={isFavorite ? star_filled : star_outlined}
            size={18}
            color={isFavorite ? '#FF9200' : undefined}
          />
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </Button>
      </TopRow>

      {loading && (
        <LoadingWrap>
          <CircularProgress />
        </LoadingWrap>
      )}

      {error && (
        <Typography variant="body_short" color="danger">
          {error}
        </Typography>
      )}

      {!loading && weather && (
        <>
          <CurrentWeather weather={weather} locationName={locationName} />
          <ForecastTable weather={weather} />
        </>
      )}
    </Content>
  );
}
