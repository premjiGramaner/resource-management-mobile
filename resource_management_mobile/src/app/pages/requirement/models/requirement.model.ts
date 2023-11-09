import { FormControl } from "@angular/forms";

export interface requirementResponse {
    statusCode: number;
    data: {
        requirementCount?: number;
        requirementInfo: requiementData[];
    };
    message: string;
}

export interface deleteRequirementResponse {
    statusCode: number;
    data: {
        requirementInfo: requiementData | boolean;
    },
    message: string;
}

export interface requiementData {
    created_date: string,
    updated_date: string,
    requirement_id: number,
    name: string,
    Client_client_id: number,
    Location_Location_ID: number,
    location_description: string,
    experience: number,
    SPOC_id: number,
    duration: number,
    notice_period: number,
    source_mode: string,
    hire_budget: string,
    contract_budget: string,
    jd: string,
    status: number,
    priority: string,
    created_by_id: number,
    updated_by_id: number,
    SPOC_name: string,
    client_name: string,
    Location_Location_Name: string,
    status_name: string,
    created_by: string,
    updated_by: string,
    skills: skill[],
    partner: partner[]
}

export interface addRequirementData {
    requirement_id?:FormControl,
    name: FormControl,
    Client_client_id: FormControl,
    Location_Location_ID: FormControl,
    location_description: FormControl,
    experience: FormControl,
    SPOC_id: FormControl,
    duration: FormControl,
    notice_period: FormControl,
    source_mode: FormControl,
    hire_budget:FormControl,
    contract_budget: FormControl,
    jd: FormControl,
    status: FormControl,
    priority: FormControl,
    skills: FormControl,
    partner: FormControl
}

export interface addSkill {
    skill_id: FormControl,
    relevant_experience: FormControl,
    mandatory_skill: FormControl
}

export interface addPartner {
    partner_id: FormControl,
    shared_on: FormControl
}

export interface skill  {
    skill_id: number,
    category: string,
    description: string,
    relevant_experience: number,
    mandatory_skill: number
}

export interface partner {
    name: string,
    partner_id: string,
    shared_on: string
}