import { BaseResponce, skill } from 'src/app/core/base-model/base.model';

export interface partnerResponce extends BaseResponce {
    data: {
        partnerCount?: number;
        partnerInfo: partnerData[];
    };
}

export interface partnerData {
    address: string;
    contact_person_email_id: string;
    contact_person_name: string;
    contact_person_phone: string;
    created_by: string;
    created_by_id: string;
    created_date: string;
    gstn: string;
    name: string;
    pan: string;
    partner_id?: number;
    registration_number: string;
    strength: string;
    supported_mode: string;
    updated_by: string;
    updated_by_id: string;
    updated_date: string;
    skills: Partnerskill[];
}

export interface Partnerskill extends skill {
    primary_skill?: boolean;
}

export interface selectedSkill {
    description?: string;
    skill_id: string;
    specialised_ind?: number;
    relevant_experience?: number;
    primary_skill_ind?: number;
}

export interface skillResponce extends BaseResponce {
    data: {
        skillInfo: Partnerskill[];
    };
}
