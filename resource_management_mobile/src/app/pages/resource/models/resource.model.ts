import { Form, FormControl } from "@angular/forms";
import { skill as Skill } from 'src/app/core/base-model/base.model';

export interface resourceResponse {
    statusCode: number;
    data: {
        resourceCount?: number;
        resourceInfo: resourceData[];
    };
    message: string;
}

export interface resourceData {
    earliest_joining_date: string,
    created_date: string,
    updated_date: string,
    resource_id: number,
    name: string,
    source: string,
    Partner_partner_id?: number,
    type: string,
    experience: number,
    mobile_no: string,
    email_id: string,
    profile_location: string,
    ctc: number,
    ectc: number,
    notice_period: number,
    current_location: number,
    preferred_location: number,
    work_location: number,
    current_organisation: string,
    current_org_duration: string,
    reason_for_change: string,
    created_by_id: number,
    updated_by_id: number,
    preferred_location_name: string,
    current_location_name: string,
    work_location_name: string,
    partner_name?: string,
    created_by: string,
    updated_by: string,
    skills: skill[]
}

export interface addResourceData {
    resource_id?: FormControl,
    name: FormControl,
    source: FormControl,
    Partner_partner_id?: FormControl,
    type: FormControl,
    experience: FormControl,
    mobile_no: FormControl,
    email_id: FormControl,
    profile_location: FormControl,
    ctc: FormControl,
    ectc: FormControl,
    notice_period: FormControl,
    current_location: FormControl,
    preferred_location: FormControl,
    work_location: FormControl,
    earliest_joining_date: FormControl,
    current_organisation: FormControl,
    current_org_duration: FormControl,
    reason_for_change: FormControl,
    skills: addSkill[]
}

export interface addSkill {
    skill_id: FormControl,
    relevant_experience: FormControl,
    primary_skill_ind: FormControl,
    rating: FormControl
}

export interface deleteResourceResponce {
    statusCode: number,
    data: {
        resourceInfo: resourceData | boolean
    },
    message: string
}

export interface skill {
    Resource_resource_id: number,
    relevant_experience: number,
    primary_skill_ind: number,
    rating: number,
    skill: Skill,
    skill_id: number,
    description?:string,
    ratingName?:string
}