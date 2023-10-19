export interface LoginRequest {
  userName: string;
  password: string;
}

export interface LoginResponse {
  data: UserInformation;
  message: string;
  statusCode: number;
}

export interface UserInformation {
  jwt: string;
  userData: User;
}

export interface User {
  Role_role_id: number;
  name: string;
  password: string;
  user_id: number;
  user_name: string;
}
