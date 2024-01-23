import { BaseResponce } from 'src/app/core/base-model/base.model';

export interface ResourceResponse extends BaseResponce {
    data: {
        resourceRequirementCount?: number;
        resourceRequirementInfo: requirementData[];
    };
}

export interface adminResourceRequirementResponse extends BaseResponce {
    data: {
        count?: number;
        resourceRequirementMappings: adminRequirementData[];
    };
}

export interface updateStatusResponse extends BaseResponce {
    data: {
        resourceRequirementInfo: updateStatus;
    };
}

export interface postResourceRequest extends requirementBasicData {
    resources?: resourceIDs[];
    Resource_requirement_id?: number;
    evaluated_by_name?: string;
    requirement?: string;
}

export interface deleteResponce {
    data: {
        resourceRequirementInfo: requirementData | boolean;
    };
}

export interface editResourceRequest extends postResourceRequest {
    Resource_requirement_id: number;
}

export interface requirementData extends requirementBasicData {
    Resource_requirement_id: number;
    ResourceRequirementMappings: requirementDataMaping[];
    requirement: string;
    evaluated_by_name: string;
}

export interface updateStatus {
    Resource_requirement_id: number;
    Requirement_requirement_id: number;
    Resource_resource_id: number;
    Status_status_id: number;
    Stage_stage_id: number;
}

export interface adminRequirementData extends updateStatus {
    requirement: string;
    resource: string;
    stage: string;
    status: string;
}

export interface resourceData
    extends resourceIDs,
    ResourceRequirementMappingsNewKeys {
    resource_name: string;
    stage_description: string;
    status_description: string;
}

export interface viewResourceData extends postResourceRequest {
    requirement?: string;
    evaluated_by_name?: string;
    evaluated_c_date?: string;
    ResourceRequirementMappings: ResourceRequirementMappingsNewKeys[];
}

export interface ResourceRequirementMappingsNewKeys {
    resourceName?: string;
    stageDescription?: string;
    statusDescription?: string;
    Resource_resource_id?: number;
    Stage_stage_id?: number;
    Status_status_id?: number;
}

export interface resourceMatchedData {
    data: {
        resourceInfo: resourceInfo[];
    };
}

export interface requirementBasicData {
    evaluated_date: string | Date;
    Requirement_requirement_id: number;
    evaluated_by: number;
    comments: string;
}

export interface resourceIDs {
    resource_id: number;
    stage_id: number;
    status_id: number;
}

export interface requirementDataMaping {
    Requirement_requirement_id: number;
    Resource_resource_id: number;
    Status_status_id: number;
    Stage_stage_id: number;
    resourceName: string;
    stageDescription: string;
    statusDescription: string;
}

export interface resourceInfo {
    earliest_joining_date: string;
    created_date: string;
    updated_date: string;
    resource_id: number;
    name: string;
    source: string;
    Partner_partner_id: number;
    type: string;
    experience: string;
    mobile_no: string;
    email_id: string;
    profile_location: string;
    ctc: string;
    ectc: string;
    notice_period: string;
    current_location: number;
    preferred_location: number;
    work_location: number;
    current_organisation: string;
    current_org_duration: string;
    reason_for_change: string;
    created_by_id: number;
    updated_by_id: number;
    partner_name: string;
    preferred_location_name: string;
    current_location_name: string;
    work_location_name: string;
    created_by: string;
    updated_by: string;
    totalExp: string;
    skills: resourceSkills[];
}

export interface resourceSkills {
    Resource_resource_id: number;
    relevant_experience: string;
    primary_skill_ind: number;
    rating: number;
    skill: {
        skill_id: number;
        category: string;
        description: string;
    };
    skill_id: number;
}

export interface resourceId {
    requirementId: number;
}

export interface resourceEntireData {
    Client_client_id: number;
    Location_Location_ID: number;
    Location_Location_Name: string;
    Partner?: resourcePartner[];
    SPOC_id: number;
    SPOC_name: string;
    client_name: string;
    contract_budget: string;
    created_by: string;
    created_by_id: number;
    created_date: string;
    duration: string | number;
    experience: string | number;
    hire_budget: string;
    jd: string;
    location_description: string;
    name: string;
    notice_period: number;
    priority: string;
    requirement_id: number;
    skills: resourceSkill[];
    source_mode: string;
    status: number;
    status_name: string;
    updated_by: string;
    updated_by_id: number;
    updated_date: string;
}

export interface resourceSkill {
    category: string;
    relevant_experience: number;
    description: string;
    mandatory_skill: number;
    skill_id: number;
}

export interface resourcePartner {
    name: string;
    partner_id: number;
    shared_on: string;
}
