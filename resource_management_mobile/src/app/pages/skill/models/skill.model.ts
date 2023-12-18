import { BaseResponce, skill } from 'src/app/core/base-model/base.model';

export interface skillResponce extends BaseResponce {
    data: {
        skillCount?: number;
        skillInfo: skill[];
    };
}

export interface skillPostResponce extends BaseResponce {
    data: {
        skillInfo: skillData
    };
}

export interface skillData extends skill {
    id?: string;
}

