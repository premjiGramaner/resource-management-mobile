import { BaseResponce } from 'src/app/core/base-model/base.model';
import { clientFilterData } from './dashboard.model';

export interface dashboardClientResponse extends BaseResponce {
    data: {
        dashboardClientInfo: clientFilterData[];
    };
}
