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

export interface clientFilterData {
    Date: number;
    data: countDetails[];
}

export interface requirementFilterData {
    Date: number;
    data: requirementDetails[];
}

export interface requirementDetails {
    Count: number;
    hiring_stage: string
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
    type: string;
}

export interface ClientData {
    label: string;
    data: number[];
}

export interface ChartInstance {
    destroy: () => void;
}

export interface ClientDataSet {
    label: string;
    data: number[] | string[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
}

export interface requirementDataSet extends ClientDataSet {

}
