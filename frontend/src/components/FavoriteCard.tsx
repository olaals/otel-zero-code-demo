import { Card, Typography, Button, Icon } from '@equinor/eds-core-react';
import { close } from '@equinor/eds-icons';
import type { WeatherResponse, Favorite } from '../types/weather';
import { getWeatherDescription, getWeatherEmoji } from '../types/weather';
import styled from 'styled-components';

const ClickableCard = styled(Card)`
  cursor: pointer;
  transition: box-shadow 0.2s ease, transform 0.15s ease;
  position: relative;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
`;

const CardInner = styled.div`
  padding: 20px;
`;

const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const RemoveButton = styled(Button)`
  position: absolute;
  top: 8px;
  right: 8px;
`;

const TempRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-top: 12px;
`;

const BigTemp = styled.span`
  font-size: 40px;
  font-weight: 700;
  color: #007079;
  line-height: 1;
`;

const WeatherEmoji = styled.span`
  font-size: 28px;
`;

const DetailRow = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 12px;
`;

const DetailItem = styled.div`
  background: #f7f7f7;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
`;

const LoadingPlaceholder = styled.div`
  padding: 20px;
  text-align: center;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface Props {
  favorite: Favorite;
  weather: WeatherResponse | null;
  onClick: () => void;
  onRemove: () => void;
}

export function FavoriteCard({ favorite, weather, onClick, onRemove }: Props) {
  if (!weather) {
    return (
      <ClickableCard onClick={onClick}>
        <LoadingPlaceholder>
          <div>
            <Typography variant="h5">{favorite.name}</Typography>
            <Typography variant="caption" color="secondary">
              {favorite.country ?? ''}
            </Typography>
            <Typography variant="body_short" style={{ marginTop: 8, color: '#999' }}>
              Loading weather...
            </Typography>
          </div>
        </LoadingPlaceholder>
      </ClickableCard>
    );
  }

  const { current } = weather;
  const emoji = getWeatherEmoji(current.weather_code, current.is_day === 1);
  const description = getWeatherDescription(current.weather_code);

  return (
    <ClickableCard onClick={onClick}>
      <RemoveButton
        variant="ghost_icon"
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <Icon data={close} size={16} />
      </RemoveButton>
      <CardInner>
        <CardTop>
          <div>
            <Typography variant="h5">{favorite.name}</Typography>
            <Typography variant="caption" color="secondary">
              {favorite.country ?? ''}
            </Typography>
          </div>
        </CardTop>

        <TempRow>
          <BigTemp>{Math.round(current.temperature_2m)}°C</BigTemp>
          <WeatherEmoji>{emoji}</WeatherEmoji>
          <Typography variant="body_short">{description}</Typography>
        </TempRow>

        <DetailRow>
          <DetailItem>
            <Typography variant="caption" color="secondary">Wind</Typography>
            <Typography variant="body_short" bold>{current.wind_speed_10m} km/h</Typography>
          </DetailItem>
          <DetailItem>
            <Typography variant="caption" color="secondary">Humidity</Typography>
            <Typography variant="body_short" bold>{current.relative_humidity_2m}%</Typography>
          </DetailItem>
          <DetailItem>
            <Typography variant="caption" color="secondary">Feels like</Typography>
            <Typography variant="body_short" bold>{Math.round(current.apparent_temperature)}°C</Typography>
          </DetailItem>
        </DetailRow>
      </CardInner>
    </ClickableCard>
  );
}
