import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import HealthMap from '../components/HealthMap';
import { getHealthPosts } from '../services/triageService';

export default function MapPage() {
  
  const { t, location: userLocation, recommendedFacilities, recommendedFacilityType } = useApp(); 
  const routerLocation = useLocation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const targetHospital = routerLocation.state?.targetHospital || null;
  
  useEffect(() => {
    if (Array.isArray(recommendedFacilities) && recommendedFacilities.length > 0) {
      setPosts(recommendedFacilities);
      return;
    }

    setLoading(true);

    getHealthPosts(userLocation?.lat ?? null, userLocation?.lng ?? null, recommendedFacilityType || 'clinic', 10)
      .then((data) => { 

        setPosts(Array.isArray(data) ? data : (data.posts || [])); 
        setLoading(false); 
      })
      .catch(() => { 
        setError(t.errors.fetchFailed); 
        setLoading(false); 
      });
  }, [userLocation, recommendedFacilities, recommendedFacilityType, t.errors.fetchFailed]);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center justify-between">
        <h2 className="font-bold text-gray-800">{t.map.title}</h2>
        {loading && <span className="text-xs text-gray-400 animate-pulse">{t.map.loading}</span>}
        {posts.length > 0 && !loading && (
          <span className="text-xs text-gray-500">{posts.length} {recommendedFacilityType || 'clinic'} facilities found</span>
        )}
      </div>

      {!userLocation && !targetHospital && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-700">
          {t.map.noLocation}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-xs text-red-600">{error}</div>
      )}

      <div className="flex-1">
        <HealthMap posts={posts} targetHospital={targetHospital} />
      </div>
    </div>
  );
}
