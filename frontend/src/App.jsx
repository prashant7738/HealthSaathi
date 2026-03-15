import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';

// Pages
import ChatPage from './pages/ChatPage';
import MapPage from './pages/MapPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';

// Components
import Sidebar from './components/Sidebar';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="flex h-screen bg-gradient-to-br from-primary-50 to-primary-100">
          <Sidebar />
          <div className="flex-1 overflow-hidden">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<ChatPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </Suspense>
          </div>
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
