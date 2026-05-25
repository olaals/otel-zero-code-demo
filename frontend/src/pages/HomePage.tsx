import { useState, useEffect, useCallback } from 'react';
import { Typography, CircularProgress, Button, Icon, Card } from '@equinor/eds-core-react';
import { star_filled } from '@equinor/eds-icons';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { SearchLocation } from '../components/SearchLocation';
import { FavoriteCard } from '../components/FavoriteCard';
import { fetchWeather, getFavorites, addFavorite, removeFavorite } from '../api/weatherApi';
import type { WeatherResponse, GeocodingResult, Favorite } from '../types/weather';

const Content = styled.main`
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const WelcomeBanner = styled.div`
  background: linear-gradient(135deg, #007079 0%, #004f54 100%);
  border-radius: 8px;
  padding: 32px;
  color: white;
`;

const WelcomeRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const DateText = styled.div`
  margin-top: 8px;
  opacity: 0.85;
  font-size: 14px;
`;

const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const FavoritesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

const LoadingWrap = styled.div`
  display: flex;
  justify-content: center;
  padding: 48px 0;
`;

const EmptyCard = styled(Card)`
  padding: 32px;
  text-align: center;
  grid-column: 1 / -1;
`;

const STAVANGER = { name: 'Stavanger', latitude: 58.97, longitude: 5.73, country: 'Norway' };

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatToday(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function HomePage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [weatherMap, setWeatherMap] = useState<Record<number, WeatherResponse>>({});
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    try {
      const favs = await getFavorites();
      setFavorites(favs);
      return favs;
    } catch {
      return [];
    }
  }, []);

  const loadWeatherForFavorites = useCallback(async (favs: Favorite[]) => {
    const results: Record<number, WeatherResponse> = {};
    await Promise.all(
      favs.map(async (fav) => {
        try {
          const data = await fetchWeather(fav.latitude, fav.longitude);
          results[fav.id] = data;
        } catch {
          // skip failed fetches
        }
      })
    );
    setWeatherMap(results);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const favs = await loadFavorites();
      if (favs.length > 0) {
        await loadWeatherForFavorites(favs);
      }
      setLoading(false);
    })();
  }, [loadFavorites, loadWeatherForFavorites]);

  const handleLocationSelect = (loc: GeocodingResult) => {
    navigate(`/weather/${loc.latitude}/${loc.longitude}?name=${encodeURIComponent(loc.name)}`);
  };

  const handleToggleFavorite = async (loc: GeocodingResult) => {
    const existing = favorites.find(
      (f) =>
        Math.abs(f.latitude - loc.latitude) < 0.01 &&
        Math.abs(f.longitude - loc.longitude) < 0.01
    );

    if (existing) {
      await removeFavorite(existing.id);
    } else {
      await addFavorite({
        name: loc.name,
        latitude: loc.latitude,
        longitude: loc.longitude,
        country: loc.country ?? null,
      });
    }
    const updatedFavs = await loadFavorites();
    await loadWeatherForFavorites(updatedFavs);
  };

  const handleRemoveFavorite = async (id: number) => {
    await removeFavorite(id);
    const updatedFavs = await loadFavorites();
    await loadWeatherForFavorites(updatedFavs);
  };

  const handleFavoriteClick = (fav: Favorite) => {
    navigate(`/weather/${fav.latitude}/${fav.longitude}?name=${encodeURIComponent(fav.name)}`);
  };

  const handleDefaultClick = () => {
    navigate(
      `/weather/${STAVANGER.latitude}/${STAVANGER.longitude}?name=${encodeURIComponent(STAVANGER.name)}`
    );
  };

  return (
    <Content>
      <WelcomeBanner>
        <WelcomeRow>
          <div>
            <Typography variant="h2" as="h1" style={{ color: 'white' }}>
              {getGreeting()}, Ola
            </Typography>
            <DateText>{formatToday()}</DateText>
          </div>
        </WelcomeRow>
      </WelcomeBanner>

      <SearchRow>
        <SearchLocation
          onSelect={handleLocationSelect}
          onToggleFavorite={handleToggleFavorite}
          favorites={favorites}
        />
      </SearchRow>

      <div>
        <SectionHeader>
          <Icon data={star_filled} size={18} color="#FF9200" />
          <Typography variant="h4">Your Favorites</Typography>
        </SectionHeader>

        {loading ? (
          <LoadingWrap>
            <CircularProgress />
          </LoadingWrap>
        ) : (
          <FavoritesGrid>
            {favorites.length === 0 ? (
              <EmptyCard>
                <Typography variant="body_short" style={{ marginBottom: 16 }}>
                  You haven't saved any favorite locations yet. Search for a city and click the star to save it.
                </Typography>
                <Button onClick={handleDefaultClick}>
                  View Stavanger Weather
                </Button>
              </EmptyCard>
            ) : (
              favorites.map((fav) => (
                <FavoriteCard
                  key={fav.id}
                  favorite={fav}
                  weather={weatherMap[fav.id] ?? null}
                  onClick={() => handleFavoriteClick(fav)}
                  onRemove={() => handleRemoveFavorite(fav.id)}
                />
              ))
            )}
          </FavoritesGrid>
        )}
      </div>
    </Content>
  );
}
