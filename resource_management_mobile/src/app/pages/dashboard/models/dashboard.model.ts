export interface baseReqString {
    filterType: string;
    label: string[];
}

export interface clientChartData extends baseReqString {
    dataset: clientFilterData[];
}
export interface requirementChartData extends baseReqString {
    dataset: requirementFilterData[];
}

export interface resourceChartData extends baseReqString {
    dataset: resourceFilterData[];
}

export interface remainderChartData extends baseReqString {
    dataset: requirementFilterData[];
}

export interface clientFilterData {
    Date: number;
    data: countDetails[];
}

export interface requirementFilterData {
    Date: number;
    data: requirementDetails[];
}

export interface hiringChartData extends baseReqString {
    dataset: hiringFilterData[];
    category: string;
}

export interface hiringFilterData {
    Date: number;
    data: hiringDetails[];
}

export interface hiringDetails {
    Count: number;
    hiring_stage: string;
    hiring_status: string;
}
export interface resourceRequirementChartData extends baseReqString {
    dataset: resourceRequirementFilterData[];
    category: string;
}

export interface resourceRequirementFilterData {
    Date: number;
    Resource_requirement_id: number;
    data: resourceRequirementDetails[];
}

export interface resourceRequirementDetails {
    Count: number;
    Stage_stage_id: number;
    stage: {
        description: string;
    };

    Status_status_id: number;
    status: {
        description: string;
    };
}
export interface resourceFilterData {
    Date: number;
    data: resorceDetails[];
}

export interface resorceDetails {
    type: string;
    Count: number;
}
export interface requirementDetails {
    Count: number;
    hiring_stage: string;
}

export interface countDetails {
    Count: number;
    owner: {
        name: string;
    };
}

export interface PostClientChart {
    startDate: string;
    endDate: string;
    type?: string;
}

export interface PostCategoryChart extends PostClientChart {
    category?: string;
}

export interface PostRemainderChart extends PostClientChart {
    userId: number;
}

export interface ClientData {
    label: string;
    data: number[];
}

export interface ChartInstance {
    destroy: () => void;
    update: () => void;
}

export interface ClientDataSet {
    label: string;
    data: number[] | string[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
}

export interface requirementDataSet extends ClientDataSet { }
export interface resourceDataSet extends ClientDataSet { }
export interface remainderDataSet extends ClientDataSet { }
export interface hiringDataSet extends ClientDataSet { }
export interface resourceRequirementDataSet extends ClientDataSet { }
