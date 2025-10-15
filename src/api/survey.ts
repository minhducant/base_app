import { ApiUrl } from '@configs/apiUrl';
import { client } from '@configs/axiosConfig';

export class SurveyApi {
  static async createSurvey(params: any) {
    const response = await client.post(ApiUrl.survey.send_survey, params);
    return response.data;
  }
  static async getRating() {
    const response = await client.get(ApiUrl.survey.get_rating);
    return response;
  }
}
