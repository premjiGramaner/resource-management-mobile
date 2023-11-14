
export interface BaseResponce {
    statusCode: number;
    message: string;
}

export interface skill {
    skill_id: number;
    category: string;
    description: string;
}
export interface userProfile {
    name: string;
    user_id: number;
    user_name: string;
    roleInfo: role;
}

export interface role {
    id: number;
    name: string;
}