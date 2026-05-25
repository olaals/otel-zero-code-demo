import { Card, Typography } from '@equinor/eds-core-react';
import type { WeatherResponse } from '../types/weather';
import { getWeatherDescription, getWeatherEmoji } from '../types/weather';
import styled from 'styled-components';

const StyledCard = styled(Card)`
  padding: 24px;
`;

const WeatherGrid = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  align-items: center;
  margin-top: 16px;
`;

const TempDisplay = styled.div`
  text-align: center;
`;

const BigTemp = styled.div`
  font-size: 56px;
  font-weight: 700;
  line-height: 1;
  color: #007079;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 16px;
`;

const DetailItem = styled.div`
  background: #f7f7f7;
  padding: 12px;
  border-radius: 4px;
`;

interface Props {
  weather: WeatherResponse;
  locationName: string;
}

export function CurrentWeather({ weather, locationName }: Props) {
  const { current } = weather;
  const emoji = getWeatherEmoji(current.weather_code, current.is_day === 1);
  const description = getWeatherDescription(current.weather_code);

  return (
    <StyledCard>
      <Card.Header>
        <Card.HeaderTitle>
          <Typography variant="h3">{locationName}</Typography>
          <Typography variant="body_short" color="secondary">
            Current Weather
          </Typography>
        </Card.HeaderTitle>
      </Card.Header>
      <Card.Content>
        <WeatherGrid>
          <TempDisplay>
            <BigTemp>{Math.round(current.temperature_2m)}°C</BigTemp>
            <Typography variant="h4" style={{ marginTop: 4 }}>
              {emoji} {description}
            </Typography>
          </TempDisplay>
          <div>
            <Typography variant="body_short" color="secondary">
              Feels like {Math.round(current.apparent_temperature)}°C
            </Typography>
          </div>
        </WeatherGrid>

        <DetailGrid>
          <DetailItem>
            <Typography variant="caption" color="secondary">
              Humidity
            </Typography>
            <Typography variant="h6">{current.relative_humidity_2m}%</Typography>
          </DetailItem>
          <DetailItem>
            <Typography variant="caption" color="secondary">
              Wind Speed
            </Typography>
            <Typography variant="h6">{current.wind_speed_10m} km/h</Typography>
          </DetailItem>
          <DetailItem>
            <Typography variant="caption" color="secondary">
              Wind Direction
            </Typography>
            <Typography variant="h6">{current.wind_direction_10m}°</Typography>
          </DetailItem>
          <DetailItem>
            <Typography variant="caption" color="secondary">
              Timezone
            </Typography>
            <Typography variant="h6">{weather.timezone}</Typography>
          </DetailItem>
        </DetailGrid>
      </Card.Content>
    </StyledCard>
  );
}
