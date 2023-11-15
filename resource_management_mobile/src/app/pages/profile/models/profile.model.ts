export interface addUserResponse {
    statusCode: number;
    data: {
        createStatus: boolean | {
            isFulfilled: boolean;
            isRejected: boolean
        }
    };
    message:string
}

export interface addUser {
    name:string;
    userName:string;
    password: string;
    roleID: number
}