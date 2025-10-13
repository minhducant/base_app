import Geolocation from 'react-native-geolocation-service';
// Add these helper functions near the top of the component

export const getCurrentPosition = (): Promise<[number, number]> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        const coords: [number, number] = [
          position.coords.longitude,
          position.coords.latitude,
        ];
        resolve(coords);
      },
      error => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
};