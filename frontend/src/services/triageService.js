export const triageService = {
  getStats: async () => {
    try {
      const response = await fetch('/api/triage/stats', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch stats');
      return await response.json();
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },

  assessSymptoms: async (symptoms) => {
    try {
      const response = await fetch('/api/triage/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error assessing symptoms:', error);
      return null;
    }
  },

  getRiskAssessment: async (healthData) => {
    try {
      const response = await fetch('/api/triage/risk-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(healthData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error getting risk assessment:', error);
      return null;
    }
  },

  getHealthPosts: async (lat, lng, facilityType, limit) => {
    try {
      const params = new URLSearchParams();
      if (lat) params.append('latitude', lat);
      if (lng) params.append('longitude', lng);
      if (facilityType) params.append('type', facilityType);
      if (limit) params.append('limit', limit);
      
      const response = await fetch(`/api/facilities/nearby?${params}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch facilities');
      return await response.json();
    } catch (error) {
      console.error('Error fetching health posts:', error);
      throw error;
    }
  },
};
