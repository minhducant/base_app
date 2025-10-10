export const API_PREFIX = '/api/v1';
export const MAIN_DOMAIN = 'http://172.104.189.80:3003';
// export const MAIN_DOMAIN = 'http://192.168.1.132:3003';

export const ApiUrl = {
  auth: {
    delete_account: '/client',
    sign_up: '/client/sign-up',
    login: '/auth/client/login',
    update_user_info: '/client',
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
  trip: {
    get_report: '/trips/report',
    get_trips: '/trips',
    get_trip_detail: '/trips',
    create_trip: '/trips',
    update_trip: '/trips',
    delete_trip: '/trips',
    ongoing_trips: '/trips/ongoing',
  },
  goal: {
    get_goal: '/goal',
    create_goal: '/goal',
  },
};
