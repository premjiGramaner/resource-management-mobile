import { BaseResponce } from "src/app/core/base-model/base.model";

export interface addUserResponse extends BaseResponce{
    data: {
        createStatus: boolean | {
            isFulfilled: boolean;
            isRejected: boolean
        }
    };
}

export interface addUser {
    name:string;
    userName:string;
    password: string;
    roleID: number
}