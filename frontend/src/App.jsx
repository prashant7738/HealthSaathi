import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import ChatPage from './pages/ChatPage';
import MapPage from './pages/MapPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<ChatPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
