export namespace AppApiTypeRequest {
  export interface Login {
    email: string;
    password: string;
  }
  export interface getUserInfo {
    accessToken: string;
  }
  export interface LoginFacebook {
    accessToken: string;
  }
  export interface LoginGoogle {
    accessToken: string;
  }
  export interface ForgotPassword {
    email: string;
  }
  export interface Feedback {
    title: string;
    desc: string;
  }
}
