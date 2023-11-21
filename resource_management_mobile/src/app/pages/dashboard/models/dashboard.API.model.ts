import { BaseResponce } from 'src/app/core/base-model/base.model';
import { clientFilterData, requirementFilterData } from './dashboard.model';

export interface dashboardClientResponse extends BaseResponce {
    data: {
        dashboardClientInfo: clientFilterData[];
    };
}
export interface dashboardRequirementResponse extends BaseResponce {
    data: {
        dashboardClientInfo: requirementFilterData[];
    };
}
