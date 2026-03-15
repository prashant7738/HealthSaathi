export const locationService = {
  getCurrentLocation: () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject(new Error('Geolocation is not supported.'));
      }
    });
  },

  findNearbyFacilities: async (latitude, longitude, radius = 5000) => {
    try {
      const response = await fetch('/api/facilities/nearby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude, longitude, radius }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching nearby facilities:', error);
      return [];
    }
  },
};
