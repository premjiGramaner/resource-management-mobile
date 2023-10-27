export interface hiringResponse {
    statusCode: number;
    data: {
        HiringCount?: number;
        HiringInfo: hiringData[];
    };
    message: string;
}

export interface hiringData {
    evaluated_date: string,
    hiring_tracker_id: number,
    Resource_resource_id: number,
    hiring_stage: string,
    evaluated_by: number,
    hiring_status: string,
    comments: string,
    Status_status_id: number,
    status: string,
    resource_name: string,
    evaluated_by_name: string
}