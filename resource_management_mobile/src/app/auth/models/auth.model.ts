export interface LoginRequest{
    userName : string;
    password : string;
}

export interface LoginResponse{
    data :any;
    message :string;
    statusCode :string;

}