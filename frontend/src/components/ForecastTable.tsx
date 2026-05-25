import { Table, Typography, Card } from '@equinor/eds-core-react';
import type { WeatherResponse } from '../types/weather';
import { getWeatherDescription, getWeatherEmoji } from '../types/weather';
import styled from 'styled-components';

const StyledCard = styled(Card)`
  padding: 24px;
  overflow-x: auto;
`;

interface Props {
  weather: WeatherResponse;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatTime(timeStr: string): string {
  const date = new Date(timeStr);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function ForecastTable({ weather }: Props) {
  const { daily } = weather;

  return (
    <StyledCard>
      <Card.Header>
        <Card.HeaderTitle>
          <Typography variant="h4">7-Day Forecast</Typography>
        </Card.HeaderTitle>
      </Card.Header>
      <Card.Content>
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Cell>Day</Table.Cell>
              <Table.Cell>Condition</Table.Cell>
              <Table.Cell>High</Table.Cell>
              <Table.Cell>Low</Table.Cell>
              <Table.Cell>Precip.</Table.Cell>
              <Table.Cell>Wind</Table.Cell>
              <Table.Cell>Sunrise</Table.Cell>
              <Table.Cell>Sunset</Table.Cell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {daily.time.map((day, i) => (
              <Table.Row key={day}>
                <Table.Cell>
                  <Typography variant="body_short" bold>
                    {formatDate(day)}
                  </Typography>
                </Table.Cell>
                <Table.Cell>
                  {getWeatherEmoji(daily.weather_code[i])}{' '}
                  {getWeatherDescription(daily.weather_code[i])}
                </Table.Cell>
                <Table.Cell>
                  <Typography variant="body_short" bold style={{ color: '#EB0000' }}>
                    {Math.round(daily.temperature_2m_max[i])}°C
                  </Typography>
                </Table.Cell>
                <Table.Cell>
                  <Typography variant="body_short" style={{ color: '#0084C4' }}>
                    {Math.round(daily.temperature_2m_min[i])}°C
                  </Typography>
                </Table.Cell>
                <Table.Cell>{daily.precipitation_sum[i]} mm</Table.Cell>
                <Table.Cell>{Math.round(daily.wind_speed_10m_max[i])} km/h</Table.Cell>
                <Table.Cell>{formatTime(daily.sunrise[i])}</Table.Cell>
                <Table.Cell>{formatTime(daily.sunset[i])}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card.Content>
    </StyledCard>
  );
}
