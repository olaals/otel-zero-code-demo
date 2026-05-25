import { Card, Typography, Chip } from '@equinor/eds-core-react';
import type { Recommendation } from '../types/weather';
import styled from 'styled-components';

const StyledCard = styled(Card)`
  padding: 24px;
`;

const ChipGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
  margin-bottom: 16px;
`;

const Section = styled.div`
  margin-top: 16px;
`;

interface Props {
  recommendation: Recommendation;
}

export function Recommendations({ recommendation }: Props) {
  return (
    <StyledCard>
      <Card.Header>
        <Card.HeaderTitle>
          <Typography variant="h3">Recommendations</Typography>
          <Typography variant="body_short" color="secondary">
            Activity &amp; clothing suggestions
          </Typography>
        </Card.HeaderTitle>
      </Card.Header>
      <Card.Content>
        <Typography variant="body_long">{recommendation.summary}</Typography>

        <Section>
          <Typography variant="h6">Activities</Typography>
          <ChipGroup>
            {recommendation.activities.map((activity) => (
              <Chip key={activity}>{activity}</Chip>
            ))}
          </ChipGroup>
        </Section>

        <Section>
          <Typography variant="h6">What to wear</Typography>
          <ChipGroup>
            {recommendation.clothing.map((item) => (
              <Chip key={item} variant="active">{item}</Chip>
            ))}
          </ChipGroup>
        </Section>
      </Card.Content>
    </StyledCard>
  );
}
