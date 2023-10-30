import { BaseResponce, skill } from 'src/app/core/base-model/base.model';

export interface locationResponce extends BaseResponce {
    data: {
        locationCount?: number;
        locationInfo: locationData[];
    };
}

export interface locationData {
    Location_ID?: number;
    Description: string;
}
