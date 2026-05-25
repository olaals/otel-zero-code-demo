import { TopBar, Icon, Typography } from '@equinor/eds-core-react';
import { cloud, account_circle } from '@equinor/eds-icons';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledTopBar = styled(TopBar)`
  border-bottom: 2px solid #007079;
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: inherit;
`;

const UserWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export function AppTopBar() {
  return (
    <StyledTopBar>
      <TopBar.Header>
        <LogoLink to="/">
          <Icon data={cloud} size={24} />
          <Typography variant="h4" as="span">
            WeatherWatch
          </Typography>
        </LogoLink>
      </TopBar.Header>
      <TopBar.Actions>
        <UserWrap>
          <Icon data={account_circle} size={24} color="#007079" />
          <Typography variant="body_short" bold>
            Ola
          </Typography>
        </UserWrap>
      </TopBar.Actions>
    </StyledTopBar>
  );
}
