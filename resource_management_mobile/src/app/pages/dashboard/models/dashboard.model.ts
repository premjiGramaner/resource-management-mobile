export interface clientChartData {
    label: string[];
    dataset: Object[]
}

export interface clientFilterData {
    Date: string;
    data: countDetails[];
}

export interface countDetails {
    Count: number;
    owner: {
        name: string;
    }
}

