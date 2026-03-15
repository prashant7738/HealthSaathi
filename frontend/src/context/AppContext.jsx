import { createContext, useState, useContext } from 'react';
import { translations } from '../i18n/translations';

export const AppContext = createContext();

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return {
    ...ctx,
    t: translations[ctx.language],
  };
}

export function AppProvider({ children }) {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@email.com',
    avatar: 'JD',
  });

  const [language, setLanguage] = useState('en');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [location, setLocation] = useState(null);
  const [recommendedFacilities, setRecommendedFacilities] = useState([]);
  const [recommendedFacilityType, setRecommendedFacilityType] = useState('');

  const value = {
    user,
    setUser,
    language,
    setLanguage,
    voiceEnabled,
    setVoiceEnabled,
    isListening,
    setIsListening,
    location,
    setLocation,
    recommendedFacilities,
    setRecommendedFacilities,
    recommendedFacilityType,
    setRecommendedFacilityType,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
