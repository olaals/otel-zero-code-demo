import { useState, useEffect, useRef } from 'react';
import { Search, Typography, Button, Icon } from '@equinor/eds-core-react';
import { star_filled, star_outlined } from '@equinor/eds-icons';
import { useNavigate } from 'react-router-dom';
import { searchLocations } from '../api/weatherApi';
import type { GeocodingResult, Favorite } from '../types/weather';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
`;

const ResultsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  list-style: none;
  margin: 4px 0 0 0;
  padding: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  max-height: 300px;
  overflow-y: auto;
`;

const ResultItem = styled.li`
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background: #f7f7f7;
  }
`;

interface Props {
  onSelect: (location: GeocodingResult) => void;
  onToggleFavorite: (location: GeocodingResult) => void;
  favorites: Favorite[];
}

export function SearchLocation({ onSelect, onToggleFavorite, favorites }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await searchLocations(query);
        setResults(data.results ?? []);
        setShowResults(true);
      } catch {
        setResults([]);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isFavorite = (loc: GeocodingResult) =>
    favorites.some(
      (f) =>
        Math.abs(f.latitude - loc.latitude) < 0.01 &&
        Math.abs(f.longitude - loc.longitude) < 0.01
    );

  const handleSelect = (loc: GeocodingResult) => {
    setShowResults(false);
    setQuery(loc.name);
    onSelect(loc);
    navigate(`/weather/${loc.latitude}/${loc.longitude}?name=${encodeURIComponent(loc.name)}`);
  };

  return (
    <Wrapper ref={wrapperRef}>
      <Search
        placeholder="Search for a city..."
        value={query}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setQuery(e.target.value);
        }}
        onFocus={() => results.length > 0 && setShowResults(true)}
      />
      {showResults && results.length > 0 && (
        <ResultsList>
          {results.map((loc) => (
            <ResultItem key={loc.id}>
              <div
                onClick={() => handleSelect(loc)}
                style={{ flex: 1 }}
              >
                <Typography variant="body_short" bold>
                  {loc.name}
                </Typography>
                <Typography variant="caption" color="secondary">
                  {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                </Typography>
              </div>
              <Button
                variant="ghost_icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(loc);
                }}
              >
                <Icon
                  data={isFavorite(loc) ? star_filled : star_outlined}
                  size={18}
                  color={isFavorite(loc) ? '#FF9200' : undefined}
                />
              </Button>
            </ResultItem>
          ))}
        </ResultsList>
      )}
    </Wrapper>
  );
}
