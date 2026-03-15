import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { triageService } from '../services/triageService';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin, Phone, Clock, Star, Plus, Minus } from 'lucide-react';

// Custom marker icons
const createMarkerIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

// Facility color mapping
const FACILITY_COLORS = {
  Hospital: '#ef4444',
  Clinic: '#3b82f6',
  Pharmacy: '#10b981',
  Emergency: '#8b5cf6',
};

export default function MapPage() {
  const { t, location: userLocation, setLocation, recommendedFacilities, setRecommendedFacilities, recommendedFacilityType } = useApp();
  const routerLocation = useLocation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [mapCenter, setMapCenter] = useState([40.7128, -74.006]);

  const targetHospital = routerLocation.state?.targetHospital || null;

  // Initialize user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          setMapCenter([latitude, longitude]);

          // Send location to backend
          fetch('/api/location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              latitude,
              longitude,
              timestamp: new Date().toISOString(),
            }),
          }).catch((err) => console.error('Error sending location:', err));
        },
        (err) => console.log('Geolocation error:', err)
      );
    }
  }, [setLocation]);

  // Fetch health posts
  useEffect(() => {
    if (Array.isArray(recommendedFacilities) && recommendedFacilities.length > 0) {
      setPosts(recommendedFacilities);
      return;
    }

    setLoading(true);

    triageService
      .getHealthPosts(
        userLocation?.lat ?? null,
        userLocation?.lng ?? null,
        recommendedFacilityType || 'clinic',
        10
      )
      .then((data) => {
        setPosts(Array.isArray(data) ? data : data.posts || []);
        setLoading(false);
      })
      .catch(() => {
        setError(t.errors.fetchFailed);
        setLoading(false);
      });
  }, [userLocation, recommendedFacilities, recommendedFacilityType, t.errors.fetchFailed]);

  const filteredFacilities = posts.filter(
    (facility) =>
      facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center justify-between md:hidden">
        <h2 className="font-bold text-gray-800 text-lg">{t.map.title}</h2>
        {loading && <span className="text-xs text-gray-400 animate-pulse">{t.map.loading}</span>}
      </div>

      {!userLocation && !targetHospital && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-700">
          {t.map.noLocation}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-xs text-red-600">{error}</div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Facilities Sidebar */}
        <aside className="hidden sm:flex sm:flex-col w-96 bg-white border-r border-gray-200">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.map.title}</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hospitals, clinics, pharmacies..."
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm"
              />
            </div>
            {posts.length > 0 && !loading && (
              <span className="text-xs text-gray-500 mt-2 block">
                {filteredFacilities.length} {recommendedFacilityType || 'facility'} found
              </span>
            )}
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-3">
            {filteredFacilities.map((facility) => (
              <div
                key={facility.id}
                onClick={() => setSelectedFacility(facility)}
                className={`p-4 rounded-lg cursor-pointer border-2 transition-all ${
                  selectedFacility?.id === facility.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{facility.name}</h3>
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full mt-1 font-medium">
                      {facility.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={16} className="fill-current" />
                    <span className="text-sm font-medium">{facility.rating || 4.5}</span>
                  </div>
                </div>

                <div className="space-y-2 mt-3 text-sm">
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                    <span>{facility.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={16} className="flex-shrink-0" />
                    <span>{facility.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={16} className="flex-shrink-0" />
                    <span>{facility.hours}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t">
                  <span className="text-sm font-medium text-green-600">{facility.distance} away</span>
                  <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors font-medium">
                    {t.map.directions}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Map */}
        <div className="flex-1 relative bg-blue-100">
          <MapContainer center={mapCenter} zoom={13} className="w-full h-full">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            />

            {/* User Location Marker */}
            {userLocation && (
              <Marker position={[userLocation.lat, userLocation.lng]} icon={createMarkerIcon('#4f46e5')}>
                <Popup>Your Location</Popup>
              </Marker>
            )}

            {/* Facility Markers */}
            {filteredFacilities.map((facility) => (
              <Marker
                key={facility.id}
                position={[facility.lat, facility.lng]}
                icon={createMarkerIcon(FACILITY_COLORS[facility.type] || '#3b82f6')}
                eventHandlers={{
                  click: () => setSelectedFacility(facility),
                }}
              >
                <Popup>
                  <div className="min-w-xs">
                    <h4 className="font-semibold">{facility.name}</h4>
                    <p className="text-sm text-gray-600">{facility.type}</p>
                    <p className="text-xs text-gray-500 mt-1">{facility.address}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Map Controls */}
          <div className="absolute bottom-6 right-6 flex gap-2">
            <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Plus size={20} />
            </button>
            <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Minus size={20} />
            </button>
          </div>

          {/* Legend */}
          <div className="absolute bottom-6 left-6 bg-white rounded-lg shadow-lg p-4">
            <h4 className="font-semibold text-sm mb-3">{t.map.legend}</h4>
            <div className="space-y-2">
              {[
                { color: '#ef4444', label: t.map.hospital },
                { color: '#3b82f6', label: t.map.clinic },
                { color: '#10b981', label: t.map.pharmacy },
                { color: '#8b5cf6', label: t.map.emergency },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-gray-700">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* My Location Button */}
          <button className="absolute top-6 right-6 bg-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 hover:bg-gray-100 transition-colors text-sm font-medium">
            <MapPin size={16} />
            {t.map.myLocation}
          </button>
        </div>
      </div>
    </div>
  );
}
