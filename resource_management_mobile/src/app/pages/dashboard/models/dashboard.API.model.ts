import { BaseResponce } from 'src/app/core/base-model/base.model';
import {
    clientFilterData,
    hiringFilterData,
    requirementFilterData,
    resourceFilterData,
    resourceRequirementFilterData,
} from './dashboard.model';

export interface dashboardClientResponse extends BaseResponce {
    data: {
        dashboardClientInfo: clientFilterData[];
    };
}
export interface dashboardRequirementResponse extends BaseResponce {
    data: {
        dashboardReminderInfo: requirementFilterData[];
    };
}
export interface dashboardResourceResponse extends BaseResponce {
    data: {
        dashboardResourceInfo: resourceFilterData[];
    };
}
export interface dashboardHiringResponse extends BaseResponce {
    data: {
        dashboardHiringInfo: hiringFilterData[];
    };
}
export interface dashboardResourceRequirementResponse extends BaseResponce {
    data: {
        dashboardResourceRequirementInfo: resourceRequirementFilterData[];
    };
}
