import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EdsProvider } from '@equinor/eds-core-react';
import { Icon } from '@equinor/eds-core-react';
import { star_filled, star_outlined, cloud, account_circle } from '@equinor/eds-icons';
import styled from 'styled-components';

import { AppTopBar } from './components/TopBar';
import { HomePage } from './pages/HomePage';
import { WeatherPage } from './pages/WeatherPage';

Icon.add({ star_filled, star_outlined, cloud, account_circle });

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
`;

export default function App() {
  return (
    <BrowserRouter>
      <EdsProvider>
        <PageContainer>
          <AppTopBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/weather/:lat/:lon" element={<WeatherPage />} />
          </Routes>
        </PageContainer>
      </EdsProvider>
    </BrowserRouter>
  );
}
