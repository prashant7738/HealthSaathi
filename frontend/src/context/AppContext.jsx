import React, { createContext, useContext, useState, useCallback } from 'react';
import translations from '../i18n/translations';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [lang, setLang] = useState('en');
  const [location, setLocation] = useState(null); // { lat, lng, accuracy }
  const [locationError, setLocationError] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recommendedFacilityType, setRecommendedFacilityType] = useState(null);
  const [recommendedFacilities, setRecommendedFacilities] = useState([]);

  const t = translations[lang];

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'en' ? 'np' : 'en'));
  }, []);

  const addMessage = useCallback((msg) => {
    setMessages((prev) => [...prev, { id: Date.now(), ...msg }]);
  }, []);

  const clearMessages = useCallback(() => setMessages([]), []);

  return (
    <AppContext.Provider
      value={{
        lang, toggleLang, t,
        location, setLocation,
        locationError, setLocationError,
        locationLoading, setLocationLoading,
        messages, addMessage, clearMessages,
        loading, setLoading,
        recommendedFacilityType,
        setRecommendedFacilityType,
        recommendedFacilities,
        setRecommendedFacilities,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
