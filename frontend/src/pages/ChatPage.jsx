import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import ChatWindow from '../components/ChatWindow';
import { getCurrentLocation } from '../services/locationService';

export default function ChatPage() {
  const { t, location, setLocation, locationError, setLocationError, locationLoading, setLocationLoading } = useApp();

  const handleGetLocation = () => {
    setLocationLoading(true);
    setLocationError(null);
    getCurrentLocation()
      .then((loc) => { setLocation(loc); setLocationLoading(false); })
      .catch((err) => { setLocationError(err.message); setLocationLoading(false); });
  };

  // Auto-request location on first render
  useEffect(() => {
    if (!location) handleGetLocation();
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Location bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-3">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {t.location.label}
        </span>

        {locationLoading ? (
          <span className="text-xs text-gray-400 animate-pulse">{t.location.getting}</span>
        ) : location ? (
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-1 bg-green-50 border border-green-200 rounded-full px-3 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono text-green-700">
                {t.location.lat}: <strong>{location.lat.toFixed(5)}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1 bg-green-50 border border-green-200 rounded-full px-3 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono text-green-700">
                {t.location.lng}: <strong>{location.lng.toFixed(5)}</strong>
              </span>
            </div>
            <button
              onClick={handleGetLocation}
              className="text-xs text-primary-600 hover:underline ml-auto"
            >
              ↻ Refresh
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 flex-1">
            {locationError && (
              <span className="text-xs text-red-500">{t.location[locationError] || locationError}</span>
            )}
            <button
              onClick={handleGetLocation}
              className="text-xs bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded-full transition-colors"
            >
              📍 {t.location.getLocation}
            </button>
          </div>
        )}
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-hidden">
        <ChatWindow/>
      </div>
    </div>
  );
}
