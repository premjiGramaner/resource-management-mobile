import { BaseResponce, skill } from "src/app/core/base-model/base.model"
export interface statusResponse extends BaseResponce {
    data: {
        statusInfo: statusData[],
    },
}

export interface statusData {
    status_id: number,
    status_type: string,
    description: string
}

export interface stageResponse extends BaseResponce {
    data: {
        stageInfo: stageData[],
    },
}

export interface stageData {
    stage_id: number,
    description: string
}

export interface resourceResponse extends BaseResponce {
    data: {
        resourceCount?: number;
        resourceInfo: resourceData[];
    };
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
    skills: skills[]
}

export interface skills {
    Resource_resource_id: number,
    relevant_experience: number,
    primary_skill_ind: number,
    rating: number,
    skill: skill,
    skill_id: number,
    description?: string,
    ratingName?: string
}