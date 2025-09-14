export const API_PREFIX = '/api/v1';
// export const MAIN_DOMAIN = 'https:?//apicrm.hallo.co';
export const MAIN_DOMAIN = 'http://192.168.1.169:3003';

export const ApiUrl = {
  auth: {
    delete_account: '/client',
    sign_up: '/client/sign-up',
    login: '/auth/client/login',
    verify_account: '/client/verify-account',
    get_user_info: '/auth/client/current',
    login_google: '/auth/client/google/login',
    forgot_password: '/client/forgot-password',
    change_password: '/client/change-password',
    sign_up_by_code: '/client/sign-up-by-code',
    login_facebook: '/auth/client/facebook/login',
    verify_otp_forget: '/client/verify-otp-forget',
    refresh_access_token: '/auth/client/refresh_access_token',
    change_password_by_code: '/client/change-password-by-code',
  },
};
