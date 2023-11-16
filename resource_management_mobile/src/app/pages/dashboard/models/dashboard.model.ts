export interface clientChartData {
    filterType: string;
    label: string[];
    dataset: clientFilterData[];
}

export interface clientFilterData {
    Date: number;
    data: countDetails[];
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
    data: number[] | string[]; // Adjust the type based on the structure of your 'data'
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
}
