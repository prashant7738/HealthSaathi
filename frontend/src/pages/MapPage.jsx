import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom hospital icon
const hospitalIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const pharmacyIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const clinicIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Sample facilities data for demonstration
const SAMPLE_FACILITIES = [
  { id: 1, name: 'Central Hospital', type: 'hospital', lat: 27.7172, lng: 85.3240, distance: 2.3, contact: '+977-1-4261048' },
  { id: 2, name: 'Health Clinic', type: 'clinic', lat: 27.7185, lng: 85.3270, distance: 0.8, contact: '+977-1-4267890' },
  { id: 3, name: 'Pharmacy Plus', type: 'pharmacy', lat: 27.7165, lng: 85.3200, distance: 1.2, contact: '+977-1-4265432' },
  { id: 4, name: 'Medicare Hospital', type: 'hospital', lat: 27.7195, lng: 85.3290, distance: 1.5, contact: '+977-1-4269876' },
  { id: 5, name: 'District Clinic', type: 'clinic', lat: 27.7150, lng: 85.3180, distance: 2.1, contact: '+977-1-4263210' },
];

export default function MapPage() {
  const { t } = useTranslation();
  const [position, setPosition] = useState([27.7172, 85.3240]); // Kathmandu center
  const [facilities, setFacilities] = useState(SAMPLE_FACILITIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition([position.coords.latitude, position.coords.longitude]);
          setLoading(false);
        },
        (error) => {
          console.warn('Geolocation error:', error);
          setLoading(false);
          // Use default position if geolocation fails
        }
      );
    } else {
      setError(t('map.enableLocation'));
      setLoading(false);
    }
  }, []);

  const filteredFacilities = selectedType === 'all'
    ? facilities
    : facilities.filter(f => f.type === selectedType);

  const getIcon = (type) => {
    switch (type) {
      case 'hospital':
        return hospitalIcon;
      case 'pharmacy':
        return pharmacyIcon;
      case 'clinic':
        return clinicIcon;
      default:
        return L.Icon.Default.instance;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Header */}
      <div className="bg-white border-b border-primary-200 shadow-sm p-6">
        <h1 className="text-2xl font-bold text-primary-900">{t('map.title')}</h1>
        <p className="text-primary-600">{t('map.findNearby')}</p>
      </div>

      {/* Controls */}
      <div className="bg-white border-b border-primary-200 shadow-sm p-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedType === 'all'
                ? 'bg-primary-500 text-white'
                : 'bg-primary-100 text-primary-600 hover:bg-primary-200'
            }`}
          >
            {t('common.appName')}
          </button>
          <button
            onClick={() => setSelectedType('hospital')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedType === 'hospital'
                ? 'bg-red-500 text-white'
                : 'bg-red-100 text-red-600 hover:bg-red-200'
            }`}
          >
            {t('map.hospital')}
          </button>
          <button
            onClick={() => setSelectedType('clinic')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedType === 'clinic'
                ? 'bg-blue-500 text-white'
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            }`}
          >
            {t('map.clinic')}
          </button>
          <button
            onClick={() => setSelectedType('pharmacy')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedType === 'pharmacy'
                ? 'bg-green-500 text-white'
                : 'bg-green-100 text-green-600 hover:bg-green-200'
            }`}
          >
            {t('map.pharmacy')}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex gap-4 p-6 overflow-hidden">
        {/* Map */}
        <div className="flex-1 rounded-xl overflow-hidden shadow-lg">
          {loading ? (
            <div className="w-full h-full bg-primary-100 flex items-center justify-center">
              <p className="text-primary-600">{t('common.loading')}</p>
            </div>
          ) : error ? (
            <div className="w-full h-full bg-primary-100 flex items-center justify-center">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-primary-600">{error}</p>
              </div>
            </div>
          ) : (
            <MapContainer
              center={position}
              zoom={15}
              scrollWheelZoom={true}
              style={{ width: '100%', height: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* User location marker */}
              <Marker position={position} icon={L.Icon.Default.instance}>
                <Popup>{t('map.currentLocation')}</Popup>
              </Marker>

              {/* Facilities markers */}
              {filteredFacilities.map((facility) => (
                <Marker
                  key={facility.id}
                  position={[facility.lat, facility.lng]}
                  icon={getIcon(facility.type)}
                >
                  <Popup>
                    <div className="text-sm">
                      <h3 className="font-bold text-primary-900">{facility.name}</h3>
                      <p className="text-primary-600 capitalize">{facility.type}</p>
                      <p className="text-primary-600">
                        {t('map.distance')}: {facility.distance} km
                      </p>
                      <p className="text-primary-600">{t('map.contact')}: {facility.contact}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>

        {/* Facilities List */}
        <div className="w-80 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {t('map.title')}
            </h2>
            <p className="text-sm text-primary-100">
              {filteredFacilities.length} {t('common.appName')}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredFacilities.length === 0 ? (
              <div className="p-4 text-center text-primary-600">
                {t('map.noFacilities')}
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {filteredFacilities.map((facility) => (
                  <div
                    key={facility.id}
                    className="p-4 border border-primary-200 rounded-lg hover:bg-primary-50 transition cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-primary-900">{facility.name}</h3>
                        <p className="text-sm text-primary-600 capitalize">{facility.type}</p>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded text-white ${
                          facility.type === 'hospital'
                            ? 'bg-red-500'
                            : facility.type === 'clinic'
                            ? 'bg-blue-500'
                            : 'bg-green-500'
                        }`}
                      >
                        {facility.distance} km
                      </span>
                    </div>
                    <p className="text-sm text-primary-600 mt-2">{facility.contact}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
