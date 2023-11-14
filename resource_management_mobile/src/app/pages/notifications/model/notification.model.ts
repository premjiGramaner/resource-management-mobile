import { BaseResponce } from 'src/app/core/base-model/base.model';

export interface notificationResponce extends BaseResponce {
    data: {
        HiringCount?: number;
        HiringInfo: HiringInfo[];
    };
}

export interface HiringInfo {
    evaluated_date: string;
    hiring_tracker_id: number;
    Resource_resource_id: number;
    hiring_stage: string;
    evaluated_by: number;
    hiring_status: string;
    comments: string;
    Status_status_id: number;
    status: string;
    resource_name: string;
    evaluated_by_name: string;
}
