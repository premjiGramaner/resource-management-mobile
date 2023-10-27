import { skill } from 'src/app/core/base-model/base.model';

export interface clientResponce {
    statusCode: number;
    data: {
        clientCount?: number;
        clientInfo: clientData[];
    };
    message: string;
}

export interface clientData {
    created_date: string;
    updated_date: string;
    client_id: string;
    name: string;
    contact_person_name: string;
    contact_person_email_id: string;
    contact_person_phone: string;
    ownership_id: string;
    sales_person_name: string;
    sales_person_email_id: string;
    sales_person_phone: string;
    finance_person_name: string;
    finance_person_email_id: string;
    finance_person_phone: string;
    strength: string;
    address: string;
    created_by: string;
    updated_by: string;
    ownership_name: string;
    skills: skill[];
}

export interface ClientArrayData {
    address: string;
    client_id: string;
    contact_person_email_id: string;
    contact_person_name: string;
    contact_person_phone: string;
    created_by: string;
    created_date: string;
    finance_person_email_id: string;
    finance_person_name: string;
    finance_person_phone: string;
    name: string;
    ownership_id: string;
    ownership_name: string;
    sales_person_email_id: string;
    sales_person_name: string;
    sales_person_phone: string;
    skills: skill[];
    strength: string;
    updated_by: string;
    updated_date: string;
    skill_id?: string;
    skill_ids: [];
}

export interface skillData {
    statusCode: number;
    data: {
        skillInfo: Clientskill[];
    };
    message: string;
}

export interface Clientskill extends skill {
    primary_skill?: boolean;
}

export interface RoleInfo {
    id: number;
    name: string;
}

export interface UserInfo {
    user_id: number;
    user_name: string;
    name: string;
    roleInfo: RoleInfo;
}

export interface UserData {
    statusCode: number;
    data: {
        userInfo: UserInfo[];
    };
    message: string;
}
