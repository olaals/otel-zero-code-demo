import { Chip, Typography, Icon, Card } from '@equinor/eds-core-react';
import { star_filled } from '@equinor/eds-icons';
import { useNavigate } from 'react-router-dom';
import type { Favorite } from '../types/weather';
import styled from 'styled-components';

const StyledCard = styled(Card)`
  padding: 24px;
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

const EmptyState = styled.div`
  color: #6f6f6f;
  margin-top: 8px;
`;

interface Props {
  favorites: Favorite[];
  onRemove: (id: number) => void;
}

export function FavoritesList({ favorites, onRemove }: Props) {
  const navigate = useNavigate();

  const handleSelect = (fav: Favorite) => {
    navigate(`/weather/${fav.latitude}/${fav.longitude}?name=${encodeURIComponent(fav.name)}`);
  };

  return (
    <StyledCard>
      <Card.Header>
        <Card.HeaderTitle>
          <Typography variant="h4">
            <Icon data={star_filled} size={18} color="#FF9200" /> Favorites
          </Typography>
        </Card.HeaderTitle>
      </Card.Header>
      <Card.Content>
        {favorites.length === 0 ? (
          <EmptyState>
            <Typography variant="body_short">
              No favorites yet. Search for a city and click the star to save it.
            </Typography>
          </EmptyState>
        ) : (
          <ChipRow>
            {favorites.map((fav) => (
              <Chip
                key={fav.id}
                onClick={() => handleSelect(fav)}
                onDelete={() => onRemove(fav.id)}
              >
                {fav.name}{fav.country ? `, ${fav.country}` : ''}
              </Chip>
            ))}
          </ChipRow>
        )}
      </Card.Content>
    </StyledCard>
  );
}
