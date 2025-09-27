import { ApiUrl } from '@configs/apiUrl';
import { client } from '@configs/axiosConfig';
import { extraParams } from '@utils/apiResponse';

const WEATHER_KEY = '71a447561061456e9da171620252609';

export class TripApi {
  static async getTrips(params: any) {
    const response = await client.get(
      ApiUrl.trip.get_trips + extraParams(params),
    );
    return response.data;
  }
  static async getTripDetail(id: string, params: any) {
    const response = await client.get(
      `${ApiUrl.trip.get_trip_detail}/${id}` + extraParams(params),
    );
    return response.data;
  }
  static async createTrip(params: any) {
    const response = await client.post(ApiUrl.trip.create_trip, params);
    return response.data;
  }
  static async updateTrip(id: string, params: any) {
    const response = await client.patch(
      `${ApiUrl.trip.update_trip}/${id}`,
      params,
    );
    return response;
  }
  static async deleteTrip(id: string) {
    const response = await client.delete(`${ApiUrl.trip.delete_trip}/${id}`);
    return response.data;
  }
  static async getOngoingTrips(params: any) {
    const response = await client.get(
      ApiUrl.trip.ongoing_trips + extraParams(params),
    );
    return response;
  }
  static async getWeatherByCoords(lat: number, lon: number) {
    try {
      const response = await client.get(
        `https://api.weatherapi.com/v1/current.json?key=${WEATHER_KEY}&q=${lat},${lon}&aqi=yes`,
      );
      return response;
    } catch (error) {
      return null;
    }
  }
}
