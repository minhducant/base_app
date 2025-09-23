import { ApiUrl } from '@configs/apiUrl';
import { client } from '@configs/axiosConfig';
import { extraParams } from '@utils/apiResponse';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBbnSnUhWUZ1aYfq6p2lwCPFV_nXGnhzHQ';

export class mapApi {
  static async getDirection(lat: number, lon: number) {
    const response: any = await client.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          latlng: `${lat},${lon}`,
          key: GOOGLE_MAPS_API_KEY,
          language: 'vi',
        },
      },
    );
    return response?.results[0];
  }
  static async getLocationByAddress(address: string) {
    const response: any = await client.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          address,
          key: GOOGLE_MAPS_API_KEY,
          language: 'vi',
        },
      },
    );
    return response;
  }
  static async getRoute(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
    mode: 'driving' | 'walking' | 'bicycling' | 'transit' = 'driving',
  ) {
    const response: any = await client.get(
      `https://maps.googleapis.com/maps/api/directions/json`,
      {
        params: {
          origin: `${origin.lat},${origin.lng}`,
          destination: `${destination.lat},${destination.lng}`,
          mode,
          key: GOOGLE_MAPS_API_KEY,
          language: 'vi',
        },
      },
    );
    console.log('route response', response);
    return response?.routes?.[0];
  }
  static async getDistanceToStart(
    currentLocation: { lat: number; lng: number },
    startLocation: { lat: number; lng: number },
    mode: 'driving' | 'walking' | 'bicycling' | 'transit' = 'driving',
  ) {
    const response: any = await client.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json`,
      {
        params: {
          origins: `${currentLocation.lat},${currentLocation.lng}`,
          destinations: `${startLocation.lat},${startLocation.lng}`,
          mode,
          key: GOOGLE_MAPS_API_KEY,
          language: 'vi',
        },
      },
    );
    const element = response?.rows?.[0]?.elements?.[0];
    if (!element || element.status !== 'OK') return null;
    return {
      distance: element.distance, // { text: '3.2 km', value: 3210 }
      duration: element.duration, // { text: '10 phút', value: 600 }
    };
  }
}
