import {ApiUrl} from '@configs/apiUrl';
import {client} from '@configs/axiosConfig';
import {extraParams} from '@utils/apiResponse';
import {AppApiTypeRequest} from '@api/typeRequest';

export class AuthApi {
  static async getUserInfo(params: any) {
    const response = await client.get(
      ApiUrl.auth.get_user_info + extraParams(params),
    );
    return response;
  }
  static async Login(params: AppApiTypeRequest.Login) {
    const response = await client.post(ApiUrl.auth.login, params);
    return response;
  }
  static async Signup(params: any) {
    const response = await client.post(ApiUrl.auth.sign_up, params);
    return response;
  }
  static async LoginFacebook(params: AppApiTypeRequest.LoginFacebook) {
    const response = await client.post(ApiUrl.auth.login_facebook, params);
    return response;
  }
  static async LoginGoogle(params: AppApiTypeRequest.LoginGoogle) {
    const response = await client.post(ApiUrl.auth.login_google, params);
    return response;
  }
  static async ForgotPassword(params: AppApiTypeRequest.ForgotPassword) {
    const response = await client.post(ApiUrl.auth.forgot_password, params);
    return response;
  }
  static async ChangePassword(params: any) {
    const response = await client.post(ApiUrl.auth.change_password, params);
    return response;
  }
  static async ChangePasswordByCode(params: any) {
    const response = await client.post(
      ApiUrl.auth.change_password_by_code,
      params,
    );
    return response;
  }
  static async VerifyOtpForget(params: any) {
    const response = await client.post(ApiUrl.auth.verify_otp_forget, params);
    return response;
  }
  static async DeletedAccount(params: any) {
    const response = await client.delete(
      `${ApiUrl.auth.delete_account}/${params}`,
    );
    return response;
  }
  static async VerifyAcount(params: any) {
    const response = await client.post(ApiUrl.auth.verify_account, params);
    return response;
  }
}
