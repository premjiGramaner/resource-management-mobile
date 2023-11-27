import { FormControl } from "@angular/forms";

export interface hiringResponse {
    statusCode: number;
    data: {
        HiringCount?: number;
        HiringInfo: hiringData[];
    };
    message: string;
}

export interface hiringHistoryResponse {
    statusCode: number;
    data: {
        HistoryInfo: historyData[];
    };
    message: string;
}

export interface deleteHiringResponce {
    statusCode: number,
    data: {
        HiringInfo: hiringData | boolean
    },
    message: string
}

export interface hiringData {
    evaluated_date?: string,
    hiring_tracker_id: number,
    Resource_resource_id: number,
    hiring_stage: string,
    evaluated_by?: number,
    hiring_status: string,
    comments: string,
    Status_status_id: number,
    status: string,
    resource_name: string,
    evaluated_by_name?: string,
    resource_source?:string,
    resource_type?:string
}

export interface historyData {
    time: string,
    hiring_history_id: number,
    hiring_tracking_id: number,
    hiring_stage: string,
    hiring_status: string,
    Status_status_id: number,
    comments: string,
    by: number,
    status: string,
    by_name: string
}

export interface addHiringData {
    hiring_tracker_id?: FormControl
    Resource_resource_id: FormControl,
    hiring_stage?: FormControl,
    evaluated_by: FormControl,
    hiring_status?: FormControl,
    comments: FormControl,
    evaluated_date: FormControl,
    Status_status_id?: FormControl
}

export interface updateHiringStatus {
    hiring_tracker_id: FormControl,
    hiring_stage: FormControl,
    hiring_status: FormControl,
    comments: FormControl,
    Status_status_id: FormControl
}

